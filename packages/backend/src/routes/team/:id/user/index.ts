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
  TeamParamsSchema,
} from '@kc-monitor/shared'
import { generateTeamAuthPreHandler } from 'src/utils/handler/generateTeamAuthPreHandler'
import buildErrorByCode from 'src/utils/error/buildErrorByCode'
import validErrorHandler from 'src/utils/error/validErrorHandler'
import { nanoid } from 'nanoid'
import { renderInviteEmail } from '@kc-monitor/email-renderer'

interface Params {
  TeamUser: {
    id: string
    user_id: string
  }
  InviteTeamUser: {
    id: string
  }
}

interface Body {
  UpdateTeamUserRole: {
    team_role_id: number
  }
  InviteTeamUser: {
    team_role_id: number
    email: string
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
    Params: Params['InviteTeamUser']
    Body: Body['InviteTeamUser']
  }>(
    '/invite',
    {
      schema: {
        tags: ['team'],
        summary: '邀请团队成员',
        description: '邀请团队成员',
        params: TeamParamsSchema,
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
      const { id } = request.params
      const { team_role_id, email } = request.body

      const team = await fastify.prisma.teams.findUnique({
        where: { id: Number(id) },
      })
      if (!team) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '团队不存在' })
      }

      const user = await fastify.prisma.users.findUnique({
        where: { email },
        select: { id: true, team_id: true, email: true, name: true },
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
          user_id: user.id,
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

      await fastify.prisma.$transaction(async (prisma) => {
        await prisma.team_join_requests.create({
          data: {
            user_id: user.id,
            team_id: Number(id),
            type: TEAM_JOIN_REQUEST_TYPE.INVITE,
            status: TEAM_JOIN_REQUEST_STATUS.PENDING,
            created_by: Number(userId),
          },
        })

        try {
          const inviter = await prisma.users.findUnique({
            where: { id: Number(userId) },
            select: { name: true },
          })

          const token = nanoid(32)

          await fastify.redis.set(
            `team:invite:${token}`,
            JSON.stringify({
              email,
              teamId: Number(request.params.id),
            }),
            'EX',
            60 * 60 * 24 * 3
          )

          const mail = await fastify.mailer.sendMail({
            from: `"${process.env.PROJECT_NAME}" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `您被邀请加入团队「${team.name}」`,
            text: `请点击链接接受邀请：${process.env.FRONTEND_URL}/invite/accept?token=${token}`,
            html: await renderInviteEmail({
              teamName: team.name,
              inviterName: inviter?.name || '系统',
              inviteeName: user?.name,
              inviteLink: `${process.env.FRONTEND_URL}/invite/accept?token=${token}`,
            }),
          })
          if (mail.rejected.length > 0) {
            throw { code: 500, message: '邮件被拒收' }
          }
        } catch (error) {
          console.error('邮件发送失败', error)
          throw { code: 500, message: '邮件发送失败' }
        }
      })

      return reply.sendResponse({ code: 201, message: '邀请已发送' })
    }
  )
}
