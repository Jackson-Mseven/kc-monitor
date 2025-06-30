import { CustomResponseSchema, TEAM_PERMISSIONS } from '@kc-monitor/shared'
import { FastifyInstance } from 'fastify'
import buildErrorByCode from 'src/utils/error/buildErrorByCode'
import { generateTeamAuthPreHandler } from 'src/utils/handler/generateTeamAuthPreHandler'

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
}
