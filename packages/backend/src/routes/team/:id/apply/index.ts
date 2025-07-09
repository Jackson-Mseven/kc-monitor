import {
  BatchProcessTeamJoinRequestSchema,
  CustomResponseSchema,
  ProcessTeamJoinRequestSchema,
  ReadTeamJoinRequestSchema,
  TEAM_JOIN_REQUEST_STATUS,
  TEAM_JOIN_REQUEST_TYPE,
  TEAM_PERMISSIONS,
  TeamJoinRequest,
  TeamParamsSchema,
} from '@kc-monitor/shared'
import { FastifyInstance } from 'fastify'
import buildErrorByCode from 'src/utils/error/buildErrorByCode'
import validErrorHandler from 'src/utils/error/validErrorHandler'
import { generateTeamAuthPreHandler } from 'src/utils/handler/generateTeamAuthPreHandler'

interface Params {
  Read: {
    id: string
  }
  Action: {
    id: string
    requestId: string
  }
}

interface Querystring {
  Read: Partial<Pick<TeamJoinRequest, 'user_id' | 'role_id' | 'status' | 'created_by'>> & {
    search?: string
  }
}

interface Body {
  BatchApprove: {
    requestIds: number[]
  }
  BatchReject: {
    requestIds: number[]
  }
}

export default async function (fastify: FastifyInstance) {
  // 获取团队申请列表
  fastify.get<{
    Params: Params['Read']
    Querystring: Querystring['Read']
  }>(
    '/',
    {
      schema: {
        tags: ['team'],
        summary: '获取团队申请列表',
        description: '获取团队申请列表',
        params: TeamParamsSchema,
        querystring: ReadTeamJoinRequestSchema,
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
      const { search, status } = request.query

      const user = await fastify.prisma.users.findUnique({
        where: {
          id: userId,
        },
        select: {
          team_id: true,
        },
      })
      if (user?.team_id !== Number(id)) {
        reply.sendResponse({ ...buildErrorByCode(401), message: '您无权查看其他团队申请' })
      }

      const searchCondition = search
        ? {
            OR: [
              {
                users: {
                  name: {
                    contains: search,
                  },
                },
              },
              {
                users: {
                  email: {
                    contains: search,
                  },
                },
              },
            ],
          }
        : {}

      const teamJoinRequests = await fastify.prisma.team_join_requests.findMany({
        where: {
          ...searchCondition,
          ...(Number.isFinite(Number(status)) ? { status: Number(status) } : {}),
          team_id: Number(id),
          type: TEAM_JOIN_REQUEST_TYPE.APPLY,
        },
        include: {
          users: {
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
            },
          },
        },
      })

      const baseWhereCondition = { team_id: Number(id), ...searchCondition }
      const totalCount = await fastify.prisma.team_join_requests.count({
        where: baseWhereCondition,
      })
      const pendingCount = await fastify.prisma.team_join_requests.count({
        where: { ...baseWhereCondition, status: 0 },
      })
      const approvedCount = await fastify.prisma.team_join_requests.count({
        where: { ...baseWhereCondition, status: 1 },
      })
      const rejectedCount = await fastify.prisma.team_join_requests.count({
        where: { ...baseWhereCondition, status: 2 },
      })

      return reply.sendResponse({
        data: {
          counts: {
            total: totalCount,
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount,
          },
          data: teamJoinRequests,
        },
      })
    }
  )

  // 管理员通过团队申请
  fastify.post<{
    Params: Params['Action']
  }>(
    '/:requestId/approve',
    {
      schema: {
        tags: ['team'],
        summary: '管理员通过团队申请',
        description: '管理员通过团队申请',
        params: ProcessTeamJoinRequestSchema,
        response: {
          200: CustomResponseSchema,
        },
      },
      preHandler: [fastify.authenticate, generateTeamAuthPreHandler(TEAM_PERMISSIONS.TEAM_MANAGE)],
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      const { id, requestId } = request.params

      const teamJoinRequest = await fastify.prisma.team_join_requests.findUnique({
        where: {
          id: Number(requestId),
          team_id: Number(id),
          type: TEAM_JOIN_REQUEST_TYPE.APPLY,
        },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              team_id: true,
            },
          },
        },
      })
      if (!teamJoinRequest) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '申请不存在' })
      }
      if (teamJoinRequest.status !== TEAM_JOIN_REQUEST_STATUS.PENDING) {
        return reply.sendResponse({ ...buildErrorByCode(400), message: '申请已被处理' })
      }
      if (teamJoinRequest.users.team_id) {
        return reply.sendResponse({ ...buildErrorByCode(400), message: '用户已加入其他团队' })
      }

      await fastify.prisma.$transaction(async (prisma) => {
        await prisma.team_join_requests.update({
          where: { id: teamJoinRequest.id },
          data: {
            status: TEAM_JOIN_REQUEST_STATUS.APPROVED,
            dispose_at: new Date(),
          },
        })

        await prisma.team_join_requests.updateMany({
          where: {
            user_id: teamJoinRequest.user_id,
            id: { not: teamJoinRequest.id },
            status: TEAM_JOIN_REQUEST_STATUS.PENDING,
          },
          data: {
            status: TEAM_JOIN_REQUEST_STATUS.CANCELLED,
            dispose_at: new Date(),
          },
        })

        await prisma.users.update({
          where: { id: teamJoinRequest.user_id },
          data: {
            team_id: Number(id),
            team_role_id: teamJoinRequest.role_id,
          },
        })
      })

      return reply.sendResponse({
        message: `已成功批准${teamJoinRequest.users.name}的团队申请`,
      })
    }
  )

  // 管理员拒绝团队申请
  fastify.post<{
    Params: Params['Action']
  }>(
    '/:requestId/reject',
    {
      schema: {
        tags: ['team'],
        summary: '管理员拒绝团队申请',
        description: '管理员拒绝团队申请',
        params: ProcessTeamJoinRequestSchema,
        response: {
          200: CustomResponseSchema,
        },
      },
      preHandler: [fastify.authenticate, generateTeamAuthPreHandler(TEAM_PERMISSIONS.TEAM_MANAGE)],
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      const { id, requestId } = request.params

      const teamJoinRequest = await fastify.prisma.team_join_requests.findUnique({
        where: {
          id: Number(requestId),
          team_id: Number(id),
          type: TEAM_JOIN_REQUEST_TYPE.APPLY,
        },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      if (!teamJoinRequest) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '申请不存在' })
      }

      if (teamJoinRequest.status !== TEAM_JOIN_REQUEST_STATUS.PENDING) {
        return reply.sendResponse({ ...buildErrorByCode(400), message: '申请已被处理' })
      }

      await fastify.prisma.team_join_requests.update({
        where: { id: teamJoinRequest.id },
        data: {
          status: TEAM_JOIN_REQUEST_STATUS.REJECTED,
          dispose_at: new Date(),
        },
      })

      return reply.sendResponse({
        message: `已拒绝${teamJoinRequest.users.name}的团队申请`,
      })
    }
  )

  // 批量同意团队申请
  fastify.post<{
    Params: Params['Read']
    Body: Body['BatchApprove']
  }>(
    '/batch-approve',
    {
      schema: {
        tags: ['team'],
        summary: '批量同意团队申请',
        description: '批量同意团队申请',
        params: TeamParamsSchema,
        body: BatchProcessTeamJoinRequestSchema,
        response: {
          200: CustomResponseSchema,
        },
      },
      preHandler: [fastify.authenticate, generateTeamAuthPreHandler(TEAM_PERMISSIONS.TEAM_MANAGE)],
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      const { id } = request.params
      const { requestIds } = request.body

      const requests = await fastify.prisma.team_join_requests.findMany({
        where: {
          id: { in: requestIds },
          team_id: Number(id),
          type: TEAM_JOIN_REQUEST_TYPE.APPLY,
          status: TEAM_JOIN_REQUEST_STATUS.PENDING,
        },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      if (requests.length === 0) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '未找到可处理的申请' })
      }

      await fastify.prisma.$transaction(async (prisma) => {
        await prisma.team_join_requests.updateMany({
          where: {
            id: { in: requests.map((r) => r.id) },
          },
          data: {
            status: TEAM_JOIN_REQUEST_STATUS.APPROVED,
            dispose_at: new Date(),
          },
        })

        const userIds = requests.map((r) => r.user_id)
        await prisma.team_join_requests.updateMany({
          where: {
            user_id: { in: userIds },
            id: { notIn: requests.map((r) => r.id) },
            status: TEAM_JOIN_REQUEST_STATUS.PENDING,
          },
          data: {
            status: TEAM_JOIN_REQUEST_STATUS.CANCELLED,
            dispose_at: new Date(),
          },
        })

        for (const req of requests) {
          await prisma.users.update({
            where: { id: req.user_id },
            data: {
              team_id: Number(id),
              team_role_id: req.role_id,
            },
          })
        }
      })

      return reply.sendResponse({
        message: `已同意${requests.length}个团队申请`,
      })
    }
  )

  // 批量拒绝团队申请
  fastify.post<{
    Params: Params['Read']
    Body: Body['BatchReject']
  }>(
    '/batch-reject',
    {
      schema: {
        tags: ['team'],
        summary: '批量拒绝团队申请',
        description: '批量拒绝团队申请',
        params: TeamParamsSchema,
        body: BatchProcessTeamJoinRequestSchema,
        response: {
          200: CustomResponseSchema,
        },
      },
      preHandler: [fastify.authenticate, generateTeamAuthPreHandler(TEAM_PERMISSIONS.TEAM_MANAGE)],
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      const { id } = request.params
      const { requestIds } = request.body

      const requests = await fastify.prisma.team_join_requests.findMany({
        where: {
          id: { in: requestIds },
          team_id: Number(id),
          type: TEAM_JOIN_REQUEST_TYPE.APPLY,
          status: TEAM_JOIN_REQUEST_STATUS.PENDING,
        },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      if (requests.length === 0) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '未找到可处理的申请' })
      }

      await fastify.prisma.team_join_requests.updateMany({
        where: {
          id: { in: requests.map((r) => r.id) },
        },
        data: {
          status: TEAM_JOIN_REQUEST_STATUS.REJECTED,
          dispose_at: new Date(),
        },
      })

      return reply.sendResponse({
        message: `已拒绝${requests.length}个团队申请`,
      })
    }
  )
}
