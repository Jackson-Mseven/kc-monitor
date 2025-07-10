import {
  CustomResponseSchema,
  TEAM_JOIN_REQUEST_STATUS,
  TEAM_JOIN_REQUEST_TYPE,
  TEAM_PERMISSIONS,
  TEAM_ROLES,
  TeamSchema,
} from '@kc-monitor/shared'
import { FastifyInstance } from 'fastify'
import { Team } from 'src/types/team'
import buildErrorByCode from 'src/utils/error/buildErrorByCode'
import validErrorHandler from 'src/utils/error/validErrorHandler'
import { generateTeamAuthPreHandler } from 'src/utils/handler/generateTeamAuthPreHandler'
import buildPrismaError from 'src/utils/prisma/buildPrismaError'

interface Body {
  Create: Pick<Team, 'name' | 'slug'>
  Apply: Pick<Team, 'slug'>
}

export default async function (fastify: FastifyInstance) {
  // 获取当前团队的成员列表
  fastify.get(
    '/members',
    {
      schema: {
        tags: ['teams'],
        summary: '获取当前团队的成员列表',
        description: '获取当前团队的成员列表',
        response: {
          200: CustomResponseSchema,
        },
      },
      preHandler: [fastify.authenticate, generateTeamAuthPreHandler(TEAM_PERMISSIONS.TEAM_READ)],
    },
    async (request, reply) => {
      const userId = request.user.id

      const user = await fastify.prisma.users.findUnique({
        where: { id: userId },
        select: { team_id: true },
      })

      if (!user?.team_id) {
        return reply.sendResponse({
          code: 400,
          message: '你未加入任何团队',
        })
      }

      const members = await fastify.prisma.users.findMany({
        where: { team_id: user.team_id },
        select: {
          id: true,
          uuid: true,
          created_at: true,
          name: true,
          email: true,
          team_id: true,
          team_role_id: true,
        },
      })

      return reply.sendResponse({
        data: members,
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

  // 用户退出团队
  fastify.delete(
    '/',
    {
      schema: {
        tags: ['teams'],
        summary: '用户退出团队',
        description: '用户退出团队',
        response: {
          200: CustomResponseSchema,
        },
      },
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      const userId = request.user.id

      const user = await fastify.prisma.users.findUnique({
        where: { id: userId },
        select: { team_id: true },
      })

      if (!user?.team_id) {
        return reply.sendResponse({ ...buildErrorByCode(400), message: '你未加入任何团队' })
      }

      await fastify.prisma.users.update({
        where: { id: userId },
        data: {
          team_id: null,
          team_role_id: null,
        },
      })

      return reply.sendResponse({ message: '退出团队成功' })
    }
  )

  // 用户申请加入团队
  fastify.post<{
    Body: Body['Apply']
  }>(
    '/apply',
    {
      schema: {
        tags: ['teams'],
        summary: '用户申请加入团队',
        description: '用户申请加入团队',
        response: {
          200: CustomResponseSchema,
        },
      },
      preHandler: fastify.authenticate,
      errorHandler: validErrorHandler,
    },
    async (req, reply) => {
      const userId = req.user.id
      const { slug } = req.body

      const user = await fastify.prisma.users.findUnique({
        where: { id: userId },
        select: {
          team_id: true,
        },
      })
      if (user?.team_id) {
        return reply.sendResponse({
          ...buildErrorByCode(400),
          message: '你已加入团队，若想要加入其他团队请先退出当前团队',
        })
      }

      const team = await fastify.prisma.teams.findUnique({
        where: { slug },
        select: {
          id: true,
        },
      })
      if (!team) {
        return reply.sendResponse({ ...buildErrorByCode(400), message: '团队不存在' })
      }

      const existingTeamJoinRequest = await fastify.prisma.team_join_requests.findFirst({
        where: {
          user_id: userId,
          team_id: team.id,
          status_id: TEAM_JOIN_REQUEST_STATUS.PENDING,
        },
      })
      if (existingTeamJoinRequest) {
        return reply.sendResponse({
          code: 400,
          message: '你正在申请加入团队或有其他团队邀请你，请先处理',
        })
      }

      const teamJoinRequest = await fastify.prisma.team_join_requests.create({
        data: {
          user_id: userId,
          team_id: team.id,
          status_id: TEAM_JOIN_REQUEST_STATUS.PENDING,
          type_id: TEAM_JOIN_REQUEST_TYPE.APPLY,
          role_id: TEAM_ROLES.MEMBER,
        },
      })
      return reply.sendResponse({
        code: 201,
        data: teamJoinRequest,
      })
    }
  )
}
