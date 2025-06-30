import { CustomResponseSchema, omit, TEAM_PERMISSIONS } from '@kc-monitor/shared'
import { FastifyInstance } from 'fastify'
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
}
