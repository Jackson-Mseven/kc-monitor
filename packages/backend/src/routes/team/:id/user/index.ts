import { FastifyInstance } from 'fastify'
import { ProjectMember } from 'src/types/projectMember'
import {
  ProjectMemberSchema,
  CustomResponseSchema,
  ProjectMemberParamsSchema,
} from '@kc-monitor/shared'
import validErrorHandler from 'src/utils/error/validErrorHandler'
import buildPrismaError from 'src/utils/prisma/buildPrismaError'

interface Params {
  Project: {
    id: string
  }
  ProjectMember: {
    id: string
    user_id: string
  }
}

interface Body {
  AddUser: Pick<ProjectMember, 'user_id' | 'role_id'>
}

export default async function (fastify: FastifyInstance) {
  // 添加用户加入团队
  fastify.post<{
    Params: Params['Project']
    Body: Body['AddUser']
  }>(
    '/:id/user',
    {
      schema: {
        tags: ['team'],
        summary: '添加用户加入团队',
        description: '添加用户加入团队',
        body: ProjectMemberSchema,
        response: { 201: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      const { id } = request.params
      const { user_id, role_id } = request.body

      const team = await fastify.prisma.teams.findUnique({
        where: { id: Number(id) },
      })
      if (!team) {
        return reply.sendResponse({ code: 404, message: '团队不存在' })
      }

      const user = await fastify.prisma.users.findUnique({
        where: { id: Number(user_id) },
      })
      if (!user) {
        return reply.sendResponse({ code: 404, message: '用户不存在' })
      }

      const role = await fastify.prisma.team_roles.findUnique({
        where: { id: Number(role_id) },
      })
      if (!role) {
        return reply.sendResponse({ code: 400, message: '角色不存在' })
      }

      const exist = await fastify.prisma.team_members.findFirst({
        where: {
          user_id: Number(user_id),
          team_id: Number(id),
        },
      })
      if (exist) {
        return reply.sendResponse({ code: 409, message: '用户已在该团队中' })
      }

      const userTeam = await fastify.prisma.team_members.create({
        data: {
          team_id: Number(id),
          ...request.body,
        },
      })
      return reply.sendResponse({ code: 201, data: userTeam })
    }
  )

  // 移除用户出团队
  fastify.delete<{
    Params: Params['ProjectMember']
  }>(
    '/:id/user/:user_id',
    {
      schema: {
        tags: ['team'],
        summary: '移除用户出团队',
        description: '移除用户出团队',
        params: ProjectMemberParamsSchema,
        response: { 200: CustomResponseSchema },
      },
    },
    async (request, reply) => {
      const { id, user_id } = request.params

      const userTeam = await fastify.prisma.team_members.findFirst({
        where: {
          user_id: Number(user_id),
          team_id: Number(id),
        },
      })
      if (!userTeam) {
        const response = buildPrismaError('P2025', {
          message: '用户未在该团队中',
        })
        return reply.sendResponse({ code: response?.code, ...response?.data })
      }

      await fastify.prisma.team_members.delete({
        where: {
          id: userTeam.id,
        },
      })
      return reply.sendResponse({ message: '用户已移出团队' })
    }
  )
}
