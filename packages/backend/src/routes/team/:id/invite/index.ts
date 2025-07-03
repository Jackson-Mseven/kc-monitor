import { FastifyInstance } from 'fastify'
import {
  CustomResponseSchema,
  InviteInfoSchema,
  InviteTeamUserSchema,
  TEAM_JOIN_REQUEST_STATUS,
  TEAM_JOIN_REQUEST_TYPE,
  TEAM_PERMISSIONS,
  TEAM_REQUEST_REDIS_KEY,
  TEAM_ROLES,
  TeamParamsSchema,
} from '@kc-monitor/shared'
import { generateTeamAuthPreHandler } from 'src/utils/handler/generateTeamAuthPreHandler'
import validErrorHandler from 'src/utils/error/validErrorHandler'
import buildErrorByCode from 'src/utils/error/buildErrorByCode'
import { nanoid } from 'nanoid'
import { renderInviteEmail } from '@kc-monitor/email-renderer'

interface Params {
  InviteTeamUser: {
    id: string
  }
  InviteInfo: {
    token: string
  }
  InviteAction: {
    token: string
  }
}

interface Body {
  InviteTeamUser: {
    team_role_id: number
    email: string
  }
}

export default async function (fastify: FastifyInstance) {
  // 邀请团队成员
  fastify.post<{
    Params: Params['InviteTeamUser']
    Body: Body['InviteTeamUser']
  }>(
    '/',
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
        const teamJoinRequest = await prisma.team_join_requests.create({
          data: {
            user_id: user.id,
            team_id: Number(id),
            type: TEAM_JOIN_REQUEST_TYPE.INVITE,
            status: TEAM_JOIN_REQUEST_STATUS.PENDING,
            created_by: Number(userId),
            role_id: Number(team_role_id),
          },
        })

        try {
          const inviter = await prisma.users.findUnique({
            where: { id: Number(userId) },
            select: { name: true },
          })

          const token = nanoid(32)

          await fastify.redis.set(
            `${TEAM_REQUEST_REDIS_KEY.INVITE}:${token}`,
            JSON.stringify({
              teamJoinRequestId: teamJoinRequest.id,
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

  // 根据token获取邀请数据
  fastify.get<{
    Params: Params['InviteInfo']
  }>(
    '/info/:token',
    {
      schema: {
        tags: ['team'],
        summary: '根据token获取邀请信息',
        description: '根据token获取邀请信息',
        params: InviteInfoSchema,
        response: {
          200: CustomResponseSchema,
        },
      },
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      const userId = request.user.id
      const { token } = request.params

      const inviteData = await fastify.redis.get(`${TEAM_REQUEST_REDIS_KEY.INVITE}:${token}`)
      if (!inviteData) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '邀请链接不存在或已过期' })
      }
      const { teamJoinRequestId } = JSON.parse(inviteData)

      const teamJoinRequest = await fastify.prisma.team_join_requests.findUnique({
        where: { id: Number(teamJoinRequestId) },
        include: {
          teams: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          inviter: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          team_roles: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      })
      if (!teamJoinRequest) {
        await fastify.redis.del(`${TEAM_REQUEST_REDIS_KEY.INVITE}:${token}`)
        return reply.sendResponse({ ...buildErrorByCode(404), message: '邀请数据不存在' })
      }
      if (teamJoinRequest.status !== TEAM_JOIN_REQUEST_STATUS.PENDING) {
        return reply.sendResponse({ ...buildErrorByCode(400), message: '邀请已被处理' })
      }
      if (userId !== teamJoinRequest.user_id) {
        return reply.sendResponse({ ...buildErrorByCode(403), message: '您无权查看此邀请' })
      }

      return reply.sendResponse({
        data: teamJoinRequest,
      })
    }
  )

  // 接受团队邀请
  fastify.post<{
    Params: Params['InviteAction']
  }>(
    '/accept/:token',
    {
      schema: {
        tags: ['team'],
        summary: '接受团队邀请',
        description: '接受团队邀请',
        params: InviteInfoSchema,
        response: {
          200: CustomResponseSchema,
        },
      },
      preHandler: [fastify.authenticate],
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      const userId = request.user.id
      const { token } = request.params

      const inviteData = await fastify.redis.get(`${TEAM_REQUEST_REDIS_KEY.INVITE}:${token}`)
      if (!inviteData) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '邀请链接不存在或已过期' })
      }
      const { teamJoinRequestId } = JSON.parse(inviteData)

      const teamJoinRequest = await fastify.prisma.team_join_requests.findUnique({
        where: { id: Number(teamJoinRequestId) },
        include: {
          teams: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
      if (!teamJoinRequest) {
        await fastify.redis.del(`${TEAM_REQUEST_REDIS_KEY.INVITE}:${token}`)
        return reply.sendResponse({ ...buildErrorByCode(404), message: '邀请数据不存在' })
      }
      if (teamJoinRequest.status !== TEAM_JOIN_REQUEST_STATUS.PENDING) {
        return reply.sendResponse({ ...buildErrorByCode(400), message: '邀请已被处理' })
      }
      if (teamJoinRequest.user_id !== Number(userId)) {
        return reply.sendResponse({ ...buildErrorByCode(403), message: '您无权处理此邀请' })
      }

      const user = await fastify.prisma.users.findUnique({
        where: { id: Number(userId) },
      })
      if (!user) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '用户不存在' })
      }
      if (user.team_id) {
        return reply.sendResponse({
          ...buildErrorByCode(400),
          message: '您已加入团队，无法接受邀请',
        })
      }

      await fastify.prisma.$transaction(async (prisma) => {
        await prisma.team_join_requests.update({
          where: { id: teamJoinRequest.id },
          data: {
            status: TEAM_JOIN_REQUEST_STATUS.APPROVED,
          },
        })

        await prisma.users.update({
          where: { id: Number(userId) },
          data: {
            team_id: teamJoinRequest.team_id,
            team_role_id: teamJoinRequest.role_id,
          },
        })
      })

      await fastify.redis.del(`${TEAM_REQUEST_REDIS_KEY.INVITE}:${token}`)

      return reply.sendResponse({
        message: `您已成功加入团队「${teamJoinRequest.teams.name}」`,
      })
    }
  )

  // 拒绝团队邀请
  fastify.post<{
    Params: Params['InviteAction']
  }>(
    '/reject/:token',
    {
      schema: {
        tags: ['team'],
        summary: '拒绝团队邀请',
        description: '拒绝团队邀请',
        params: InviteInfoSchema,
        response: {
          200: CustomResponseSchema,
        },
      },
      preHandler: [fastify.authenticate],
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      const userId = request.user.id
      const { token } = request.params

      const inviteData = await fastify.redis.get(`${TEAM_REQUEST_REDIS_KEY.INVITE}:${token}`)
      if (!inviteData) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '邀请链接不存在或已过期' })
      }
      const { teamJoinRequestId } = JSON.parse(inviteData)

      const teamJoinRequest = await fastify.prisma.team_join_requests.findUnique({
        where: { id: Number(teamJoinRequestId) },
        include: {
          teams: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })
      if (!teamJoinRequest) {
        await fastify.redis.del(`${TEAM_REQUEST_REDIS_KEY.INVITE}:${token}`)
        return reply.sendResponse({ ...buildErrorByCode(404), message: '邀请数据不存在' })
      }
      if (teamJoinRequest.status !== TEAM_JOIN_REQUEST_STATUS.PENDING) {
        return reply.sendResponse({ ...buildErrorByCode(400), message: '邀请已被处理' })
      }
      if (teamJoinRequest.user_id !== Number(userId)) {
        return reply.sendResponse({ ...buildErrorByCode(403), message: '您无权处理此邀请' })
      }

      await fastify.prisma.team_join_requests.update({
        where: { id: teamJoinRequest.id },
        data: {
          status: TEAM_JOIN_REQUEST_STATUS.REJECTED,
        },
      })

      await fastify.redis.del(`${TEAM_REQUEST_REDIS_KEY.INVITE}:${token}`)

      return reply.sendResponse({
        message: `您已拒绝加入团队「${teamJoinRequest.teams.name}」的邀请`,
      })
    }
  )
}
