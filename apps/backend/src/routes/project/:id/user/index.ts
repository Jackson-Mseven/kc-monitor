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
  // 添加用户加入项目
  fastify.post<{
    Params: Params['Project']
    Body: Body['AddUser']
  }>(
    '/',
    {
      schema: {
        tags: ['project'],
        summary: '添加用户加入项目',
        description: '添加用户加入项目',
        body: ProjectMemberSchema,
        response: { 201: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      const { id } = request.params
      const { user_id, role_id } = request.body

      const project = await fastify.prisma.projects.findUnique({
        where: { id: Number(id) },
      })
      if (!project) {
        return reply.sendResponse({ code: 404, message: '项目不存在' })
      }

      const user = await fastify.prisma.users.findUnique({
        where: { id: Number(user_id) },
      })
      if (!user) {
        return reply.sendResponse({ code: 404, message: '用户不存在' })
      }

      const role = await fastify.prisma.project_roles.findUnique({
        where: { id: Number(role_id) },
      })
      if (!role) {
        return reply.sendResponse({ code: 400, message: '角色不存在' })
      }

      const exist = await fastify.prisma.project_members.findFirst({
        where: {
          user_id: Number(user_id),
          project_id: Number(id),
        },
      })
      if (exist) {
        return reply.sendResponse({ code: 409, message: '用户已在该项目中' })
      }

      const userProject = await fastify.prisma.project_members.create({
        data: {
          project_id: Number(id),
          ...request.body,
        },
      })
      return reply.sendResponse({ code: 201, data: userProject })
    }
  )

  // 移除用户出项目
  fastify.delete<{
    Params: Params['ProjectMember']
  }>(
    '/:user_id',
    {
      schema: {
        tags: ['project'],
        summary: '移除用户出项目',
        description: '移除用户出项目',
        params: ProjectMemberParamsSchema,
        response: { 200: CustomResponseSchema },
      },
    },
    async (request, reply) => {
      const { id, user_id } = request.params

      const userProject = await fastify.prisma.project_members.findFirst({
        where: {
          user_id: Number(user_id),
          project_id: Number(id),
        },
      })
      if (!userProject) {
        const response = buildPrismaError('P2025', {
          message: '用户未在该项目中',
        })
        return reply.sendResponse({ code: response?.code, ...response?.data })
      }

      await fastify.prisma.project_members.delete({
        where: {
          id: userProject.id,
        },
      })
      return reply.sendResponse({ message: '用户已移出项目' })
    }
  )
}
