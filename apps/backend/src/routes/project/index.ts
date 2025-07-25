import { FastifyInstance } from 'fastify'
import validErrorHandler from 'src/utils/error/validErrorHandler'
import {
  CreateProjectSchema,
  CustomResponseSchema,
  ProjectParamsSchema,
  TEAM_PERMISSIONS,
  UpdateProjectSchema,
  generateProjectDSN,
  Project,
  ProjectQuerySchema,
} from '@kc-monitor/shared'
import generateReadByIdHandler from 'src/utils/handler/generateReadByIdHandler'
import generateUpdateHandler from 'src/utils/handler/generateUpdateHandler'
import generateDeleteHandler from 'src/utils/handler/generateDeleteHandler'
import { generateTeamAuthPreHandler } from 'src/utils/handler/generateTeamAuthPreHandler'
import buildPrismaError from 'src/utils/prisma/buildPrismaError'
import buildErrorByCode from 'src/utils/error/buildErrorByCode'
import { Prisma } from '@prisma/client'

interface Params {
  Project: {
    id: string
  }
}

interface Querystring {
  Project: { team_id: string; search?: string; platform_id?: string }
}

interface Body {
  Create: Pick<Project, 'team_id' | 'name' | 'description' | 'platform_id'>
  Update: Partial<Pick<Project, 'name' | 'description'>>
}

export default async function (fastify: FastifyInstance) {
  // 获取指定项目
  fastify.get<{
    Querystring: Querystring['Project']
  }>(
    '/',
    {
      schema: {
        tags: ['project'],
        summary: '获取所有项目',
        description: '获取所有项目',
        querystring: ProjectQuerySchema,
        response: { 200: CustomResponseSchema },
      },
      preHandler: [fastify.authenticate, generateTeamAuthPreHandler(TEAM_PERMISSIONS.TEAM_READ)],
    },
    async (request, reply) => {
      const { team_id, search, platform_id } = request.query

      const filters: Prisma.projectsWhereInput = {}
      if (team_id) {
        filters.team_id = Number(team_id)
      }
      if (platform_id) {
        filters.platform_id = Number(platform_id)
      }
      if (search) {
        filters.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      }

      const projects = await fastify.prisma.projects.findMany({
        where: filters,
        include: {
          project_platforms: true,
        },
      })

      return reply.sendResponse({ data: projects })
    }
  )

  // 获取单个项目
  fastify.get<{
    Params: Params['Project']
  }>(
    '/:id',
    {
      schema: {
        tags: ['project'],
        summary: '获取单个项目',
        description: '获取单个项目',
        params: ProjectParamsSchema,
        response: { 200: CustomResponseSchema },
      },
      preHandler: [fastify.authenticate, generateTeamAuthPreHandler(TEAM_PERMISSIONS.TEAM_READ)],
    },
    generateReadByIdHandler<Params['Project']>(fastify, {
      model: 'projects',
      idKey: 'id',
      notFoundMessage: '项目不存在',
    })
  )

  // 创建项目
  fastify.post<{
    Body: Body['Create']
  }>(
    '/',
    {
      schema: {
        tags: ['project'],
        summary: '创建项目',
        description: '创建项目',
        body: CreateProjectSchema,
        response: { 201: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
      preHandler: [fastify.authenticate, generateTeamAuthPreHandler(TEAM_PERMISSIONS.TEAM_MANAGE)],
    },
    async (request, reply) => {
      const { team_id, platform_id } = request.body

      const team = await fastify.prisma.teams.findUnique({
        where: { id: team_id },
        select: {
          slug: true,
        },
      })
      if (!team) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '团队不存在' })
      }

      const platform = await fastify.prisma.project_platforms.findUnique({
        where: { id: platform_id },
      })
      if (!platform) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '项目类型不存在' })
      }

      const project = await fastify.prisma.$transaction(async (prisma) => {
        try {
          const createdProject = await prisma.projects.create({
            data: request.body,
          })

          const dsn = generateProjectDSN({
            publicKey: createdProject.uuid,
            host: (process.env.HOST ?? '') + (process.env.PORT ?? ''),
            projectId: createdProject.id,
          })

          const updatedProject = await prisma.projects.update({
            where: { id: createdProject.id },
            data: { dsn },
          })

          return updatedProject
        } catch (error: any) {
          if (error.code === 'P2002') {
            const response = buildPrismaError(error.code, {
              message: '项目已存在',
            })
            return reply.sendResponse({
              code: response?.code,
              ...response?.data,
            })
          }
        }
      })

      return reply.sendResponse({ data: project })
    }
  )

  // 更新项目信息
  fastify.put<{
    Params: Params['Project']
    Body: Body['Update']
  }>(
    '/:id',
    {
      schema: {
        tags: ['project'],
        summary: '更新项目',
        description: '更新项目',
        body: UpdateProjectSchema,
        response: { 200: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
      preHandler: [fastify.authenticate, generateTeamAuthPreHandler(TEAM_PERMISSIONS.TEAM_MANAGE)],
    },
    generateUpdateHandler<Params['Project'], Body['Update']>(fastify, {
      model: 'projects',
      idKey: 'id',
      notFoundMessage: '项目不存在',
      uniqueMessage: '项目标识已经存在',
    })
  )

  // 删除项目
  fastify.delete<{
    Params: Params['Project']
  }>(
    '/:id',
    {
      schema: {
        tags: ['project'],
        summary: '删除项目',
        description: '删除项目',
        params: ProjectParamsSchema,
        response: { 200: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
      preHandler: [fastify.authenticate, generateTeamAuthPreHandler(TEAM_PERMISSIONS.TEAM_MANAGE)],
    },
    generateDeleteHandler<Params['Project']>(fastify, {
      model: 'projects',
      idKey: 'id',
      notFoundMessage: '项目不存在',
      successMessage: '项目已删除',
    })
  )
}
