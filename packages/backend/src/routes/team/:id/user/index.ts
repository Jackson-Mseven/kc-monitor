import { FastifyInstance } from 'fastify'
import { TEAM_PERMISSIONS, TeamUserParamsSchema } from '@kc-monitor/shared'
import { generateTeamAuthPreHandler } from 'src/utils/handler/generateTeamAuthPreHandler'
import buildErrorByCode from 'src/utils/error/buildErrorByCode'

interface Params {
  TeamUser: {
    id: string
    user_id: string
  }
}

export default async function (fastify: FastifyInstance) {
  // 移除团队成员
  fastify.delete<{
    Params: Params['TeamUser']
  }>(
    '/:user_id',
    {
      schema: {
        tags: ['team'],
        summary: '移除团队成员',
        description: '移除团队成员',
        params: TeamUserParamsSchema,
      },
      preHandler: [fastify.authenticate, generateTeamAuthPreHandler(TEAM_PERMISSIONS.TEAM_MANAGE)],
    },
    async (request, reply) => {
      const { id, user_id } = request.params

      const team = await fastify.prisma.teams.findUnique({
        where: { id: Number(id) },
      })
      if (!team) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '团队不存在' })
      }

      const user = await fastify.prisma.users.findUnique({
        where: { id: Number(user_id) },
      })
      if (!user) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '用户不存在' })
      }
      if (team.id !== Number(user.team_id)) {
        return reply.sendResponse({ ...buildErrorByCode(400), message: '用户不在团队中' })
      }

      await fastify.prisma.users.update({
        where: { id: Number(user_id) },
        data: {
          team_id: null,
          team_role_id: null,
        },
      })

      return reply.sendResponse({ message: '移除团队成员成功' })
    }
  )
}
