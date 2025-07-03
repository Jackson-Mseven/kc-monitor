import { FastifyInstance } from 'fastify'
import {
  CustomResponseSchema,
  TEAM_PERMISSIONS,
  TeamUserParamsSchema,
  UpdateTeamUserRoleSchema,
} from '@kc-monitor/shared'
import { generateTeamAuthPreHandler } from 'src/utils/handler/generateTeamAuthPreHandler'
import buildErrorByCode from 'src/utils/error/buildErrorByCode'
import validErrorHandler from 'src/utils/error/validErrorHandler'

interface Params {
  TeamUser: {
    id: string
    user_id: string
  }
}

interface Body {
  UpdateTeamUserRole: {
    team_role_id: number
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

  // 修改团队成员角色
  fastify.put<{
    Params: Params['TeamUser']
    Body: Body['UpdateTeamUserRole']
  }>(
    '/:user_id/role',
    {
      schema: {
        tags: ['team'],
        summary: '修改团队成员角色',
        description: '修改团队成员角色',
        params: TeamUserParamsSchema,
        body: UpdateTeamUserRoleSchema,
        response: {
          200: CustomResponseSchema,
        },
      },
      preHandler: [fastify.authenticate, generateTeamAuthPreHandler(TEAM_PERMISSIONS.TEAM_MANAGE)],
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      const { id, user_id } = request.params
      const { team_role_id } = request.body

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

      const teamRole = await fastify.prisma.team_roles.findUnique({
        where: { id: Number(team_role_id) },
      })
      if (!teamRole) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '团队角色不存在' })
      }

      await fastify.prisma.users.update({
        where: { id: Number(user_id) },
        data: { team_role_id: Number(team_role_id) },
      })

      return reply.sendResponse({ message: '修改团队成员角色成功' })
    }
  )
}
