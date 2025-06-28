import { FastifyInstance } from 'fastify'
import { Project } from 'src/types/project'
import validErrorHandler from 'src/utils/error/validErrorHandler'
import { ProjectSchema, CustomResponseSchema, ProjectParamsSchema } from '@kc-monitor/shared'
import generateReadHandler from 'src/utils/handler/generateReadHandler'
import generateReadByIdHandler from 'src/utils/handler/generateReadByIdHandler'
import generateCreateHandler from 'src/utils/handler/generateCreateHandler'
import generateUpdateHandler from 'src/utils/handler/generateUpdateHandler'
import generateDeleteHandler from 'src/utils/handler/generateDeleteHandler'

interface Params {
  Project: {
    id: string
  }
}

interface Body {
  Create: Pick<Project, 'name' | 'slug' | 'team_id'>
  Update: Pick<Project, 'name' | 'slug' | 'team_id'>
}

export default async function (fastify: FastifyInstance) {
  // 获取所有项目
  fastify.get(
    '/',
    {
      schema: {
        tags: ['project'],
        summary: '获取所有项目',
        description: '获取所有项目',
        response: { 200: CustomResponseSchema },
      },
    },
    generateReadHandler(fastify, {
      model: 'projects',
    })
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
        body: ProjectSchema,
        response: { 201: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    generateCreateHandler<Body['Create']>(fastify, {
      model: 'projects',
      uniqueMessage: '项目标识已经存在',
    })
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
        body: ProjectSchema.partial().refine((data) => Object.keys(data).length > 0, {
          message: '更新内容不能为空',
        }),
        response: { 200: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
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
    },
    generateDeleteHandler<Params['Project']>(fastify, {
      model: 'projects',
      idKey: 'id',
      notFoundMessage: '项目不存在',
      successMessage: '项目已删除',
    })
  )
}
