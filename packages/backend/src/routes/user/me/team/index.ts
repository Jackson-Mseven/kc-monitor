import { CustomResponseSchema, TEAM_ROLES, TeamSchema } from '@kc-monitor/shared'
import { FastifyInstance } from 'fastify'
import { Team } from 'src/types/team'
import validErrorHandler from 'src/utils/error/validErrorHandler'
import buildPrismaError from 'src/utils/prisma/buildPrismaError'

interface Body {
  Create: Pick<Team, 'name' | 'slug'>
}

export default async function (fastify: FastifyInstance) {
  // 获取用户所属团队
  fastify.get(
    '/',
    {
      schema: {
        tags: ['user'],
        summary: '获取用户所属团队',
        description: '获取当前登录用户所属的团队',
        response: {
          200: CustomResponseSchema,
        },
      },
      preHandler: fastify.authenticate,
    },
    async (req, reply) => {
      const userId = req.user.id

      const user = await fastify.prisma.users.findUnique({
        where: { id: Number(userId) },
      })

      if (!user) {
        return reply.sendResponse({
          code: 404,
          message: '用户不存在',
        })
      }

      if (!user.team_id) {
        return reply.sendResponse({ data: null })
      }

      const team = await fastify.prisma.teams.findUnique({
        where: { id: user.team_id },
      })

      if (!team) {
        return reply.sendResponse({ code: 404, message: '团队不存在' })
      }

      return reply.sendResponse({
        data: team,
      })
    }
  )

  // 创建团队
  fastify.post<{
    Body: Body['Create']
  }>(
    '/',
    {
      schema: {
        tags: ['user'],
        summary: '创建团队',
        description: '创建团队',
        body: TeamSchema,
        response: {
          200: CustomResponseSchema,
        },
      },
      preHandler: fastify.authenticate,
      errorHandler: validErrorHandler,
    },
    async (req, reply) => {
      try {
        const userId = req.user.id
        const { name, slug } = req.body

        const team = await fastify.prisma.$transaction(async (prisma) => {
          const team = await prisma.teams.create({
            data: {
              name,
              slug,
            },
          })

          await prisma.users.update({
            where: { id: Number(userId) },
            data: {
              team_id: team.id,
              team_role_id: TEAM_ROLES.OWNER,
            },
          })

          return team
        })

        if (!team) {
          return reply.sendResponse({ code: 500, message: '创建团队失败' })
        }

        return reply.sendResponse({
          code: 201,
          data: team,
        })
      } catch (error: any) {
        if (error.code === 'P2002') {
          const response = buildPrismaError(error.code, {
            message: '团队已存在',
          })
          return reply.sendResponse({ code: response?.code, ...response?.data })
        }
        return reply.sendDefaultError()
      }
    }
  )
}
