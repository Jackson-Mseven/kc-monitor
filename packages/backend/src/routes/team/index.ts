import { FastifyInstance } from 'fastify'
import { Team } from 'src/types/team'
import { CustomResponseSchema, TeamParamsSchema, TeamSchema } from '@kc-monitor/shared'
import validErrorHandler from 'src/utils/error/validErrorHandler'
import generateCreateHandler from 'src/utils/handler/generateCreateHandler'
import generateReadHandler from 'src/utils/handler/generateReadHandler'
import generateReadByIdHandler from 'src/utils/handler/generateReadByIdHandler'
import generateUpdateHandler from 'src/utils/handler/generateUpdateHandler'
import generateDeleteHandler from 'src/utils/handler/generateDeleteHandler'

interface Params {
  Team: Pick<Team, 'id'>
}
interface Body {
  Create: Pick<Team, 'name' | 'slug'>
  Update: Pick<Team, 'name' | 'slug'>
}

export default async function (fastify: FastifyInstance) {
  // 获取所有团队
  fastify.get(
    '/',
    {
      schema: {
        tags: ['team'],
        summary: '获取所有团队',
        description: '获取所有团队',
        response: { 200: CustomResponseSchema },
      },
    },
    generateReadHandler(fastify, {
      model: 'teams',
    })
  )

  // 获取单个团队
  fastify.get<{
    Params: Params['Team']
  }>(
    '/:id',
    {
      schema: {
        tags: ['team'],
        summary: '获取单个团队',
        description: '获取单个团队',
        params: TeamParamsSchema,
        response: { 200: CustomResponseSchema },
      },
    },
    generateReadByIdHandler<Params['Team']>(fastify, {
      model: 'teams',
      idKey: 'id',
      notFoundMessage: '团队不存在',
    })
  )

  // 新增团队
  fastify.post<{
    Body: Body['Create']
  }>(
    '/',
    {
      schema: {
        tags: ['team'],
        summary: '新增团队',
        description: '新增团队',
        body: TeamSchema,
        response: { 201: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    generateCreateHandler(fastify, {
      model: 'teams',
      uniqueMessage: '团队标识已经存在',
    })
  )

  // 更新团队
  fastify.put<{
    Params: Params['Team']
    Body: Body['Update']
  }>(
    '/:id',
    {
      schema: {
        tags: ['team'],
        summary: '更新团队',
        description: '更新团队',
        params: TeamParamsSchema,
        body: TeamSchema.partial().refine((data) => Object.keys(data).length > 0, {
          message: '更新内容不能为空',
        }),
        response: { 200: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    generateUpdateHandler<Params['Team'], Body['Update']>(fastify, {
      model: 'teams',
      idKey: 'id',
      notFoundMessage: '团队不存在',
      uniqueMessage: '团队标识已经存在',
    })
  )

  // 删除团队
  fastify.delete<{
    Params: Params['Team']
  }>(
    '/:id',
    {
      schema: {
        tags: ['team'],
        summary: '删除团队',
        description: '删除团队',
        params: TeamParamsSchema,
        response: { 200: CustomResponseSchema },
      },
    },
    generateDeleteHandler<Params['Team']>(fastify, {
      model: 'teams',
      idKey: 'id',
      notFoundMessage: '团队不存在',
      successMessage: '团队已删除',
    })
  )
}
