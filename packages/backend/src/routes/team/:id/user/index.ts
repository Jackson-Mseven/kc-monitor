import { FastifyInstance } from 'fastify'
import {
  CustomResponseSchema,
  TEAM_PERMISSIONS,
  TeamUserParamsSchema,
  UpdateTeamUserRoleSchema,
  InviteTeamUserSchema,
  TEAM_JOIN_REQUEST_STATUS,
  TEAM_JOIN_REQUEST_TYPE,
  TEAM_ROLES,
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
  InviteTeamUser: {
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

  // 邀请团队成员
  fastify.post<{
    Params: Params['TeamUser']
    Body: Body['InviteTeamUser']
  }>(
    '/:user_id/invite',
    {
      schema: {
        tags: ['team'],
        summary: '邀请团队成员',
        description: '邀请团队成员',
        params: TeamUserParamsSchema,
        body: InviteTeamUserSchema,
        response: {
          200: CustomResponseSchema,
        },
      },
      preHandler: [fastify.authenticate, generateTeamAuthPreHandler(TEAM_PERMISSIONS.TEAM_MANAGE)],
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      const userId = request.user.id
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
        select: { team_id: true, email: true, name: true },
      })
      if (!user) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '用户不存在' })
      }
      if (user.team_id) {
        return reply.sendResponse({ ...buildErrorByCode(400), message: '邀请失败，用户已加入团队' })
      }

      if (team_role_id === TEAM_ROLES.OWNER) {
        return reply.sendResponse({
          ...buildErrorByCode(400),
          message: '邀请失败，不能邀请团队所有者',
        })
      }
      const teamRole = await fastify.prisma.team_roles.findUnique({
        where: { id: Number(team_role_id) },
      })
      if (!teamRole) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '团队角色不存在' })
      }

      const teamJoinRequest = await fastify.prisma.team_join_requests.findFirst({
        where: {
          user_id: Number(user_id),
          team_id: Number(id),
          status: TEAM_JOIN_REQUEST_STATUS.PENDING,
        },
      })
      if (teamJoinRequest) {
        return reply.sendResponse({
          ...buildErrorByCode(400),
          message: '用户已有待处理的邀请或申请',
        })
      }

      await fastify.prisma.$transaction(async (tx) => {
        await fastify.prisma.team_join_requests.create({
          data: {
            user_id: Number(user_id),
            team_id: Number(id),
            type: TEAM_JOIN_REQUEST_TYPE.INVITE,
            status: TEAM_JOIN_REQUEST_STATUS.PENDING,
            created_by: Number(userId),
          },
        })

        const inviter = await fastify.prisma.users.findUnique({
          where: { id: Number(userId) },
          select: { name: true },
        })

        const mail = await fastify.mailer.sendMail({
          to: user.email,
          subject: `您被邀请加入团队「${team.name}」`,
          html: `
                <p>您好${user?.name ? `，${user.name}` : ''}：</p>
                <p>用户${inviter?.name || ''}邀请您加入团队「${team.name}」。</p>
                <p>请登录系统查看并处理邀请。</p>
              `,
        })
        if (!mail) {
          throw { code: 500, message: '邮件发送失败' }
        }
      })

      return reply.sendResponse({ code: 201, message: '邀请已发送' })
    }
  )
}
