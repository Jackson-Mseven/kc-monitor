import {
  CustomResponseSchema,
  TEAM_PERMISSIONS,
  TeamJoinRequest,
  TeamJoinRequestSchema,
  TeamParamsSchema,
} from '@kc-monitor/shared'
import { FastifyInstance } from 'fastify'
import buildErrorByCode from 'src/utils/error/buildErrorByCode'
import validErrorHandler from 'src/utils/error/validErrorHandler'
import { generateTeamAuthPreHandler } from 'src/utils/handler/generateTeamAuthPreHandler'
import { z } from 'zod'

interface Params {
  Read: {
    id: string
  }
}

interface Querystring {
  Read: Partial<Pick<TeamJoinRequest, 'user_id' | 'role_id' | 'type' | 'status' | 'created_by'>> & {
    search?: string
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
        querystring: TeamJoinRequestSchema.partial().extend({
          search: z.string().optional(),
        }),
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
      const { search, ...filters } = request.query

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
          ...filters,
          team_id: Number(id),
          ...searchCondition,
        },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          team_roles: true,
          inviter: {
            select: {
              id: true,
              name: true,
              email: true,
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
}
