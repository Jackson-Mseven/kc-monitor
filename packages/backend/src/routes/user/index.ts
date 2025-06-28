import { FastifyInstance } from 'fastify'
import { User } from 'src/types/user'
import { UserSchema, CustomResponseSchema, IDSchema, UserParamsSchema } from '@kc-monitor/shared'
import { z } from 'zod'
import validErrorHandler from 'src/utils/error/validErrorHandler'
import generateReadHandler from 'src/utils/handler/generateReadHandler'
import generateReadByIdHandler from 'src/utils/handler/generateReadByIdHandler'
import generateCreateHandler from 'src/utils/handler/generateCreateHandler'
import generateUpdateHandler from 'src/utils/handler/generateUpdateHandler'
import generateDeleteHandler from 'src/utils/handler/generateDeleteHandler'

interface Params {
  User: {
    id: string
  }
}
interface Body {
  Create: Pick<User, 'name' | 'password' | 'email'>
  Update: Pick<User, 'name' | 'password' | 'email'>
}

export default async function (fastify: FastifyInstance) {
  // 获取所有用户
  fastify.get(
    '/',
    {
      schema: {
        tags: ['user'],
        summary: '获取所有用户',
        description: '获取所有用户',
        response: { 200: CustomResponseSchema },
      },
    },
    generateReadHandler(fastify, {
      model: 'users',
    })
  )

  // 获取单个用户
  fastify.get<{
    Params: Params['User']
  }>(
    '/:id',
    {
      schema: {
        tags: ['user'],
        summary: '获取单个用户',
        description: '获取单个用户',
        params: z.object({
          id: IDSchema,
        }),
        response: { 200: CustomResponseSchema },
      },
    },
    generateReadByIdHandler<Params['User']>(fastify, {
      model: 'users',
      idKey: 'id',
      notFoundMessage: '用户不存在',
    })
  )

  // 新增用户
  fastify.post<{
    Body: Body['Create']
  }>(
    '/',
    {
      schema: {
        tags: ['user'],
        summary: '新增用户',
        description: '新增用户',
        body: UserSchema,
        response: { 201: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    generateCreateHandler<Body['Create']>(fastify, {
      model: 'users',
      uniqueMessage: '邮箱已经存在',
      additionalData: async (request) => ({
        password: await fastify.bcrypt.hash(request.body.password),
      }),
    })
  )

  // 修改用户信息
  fastify.put<{
    Params: Params['User']
    Body: Body['Update']
  }>(
    '/:id',
    {
      schema: {
        tags: ['user'],
        summary: '修改用户信息',
        description: '修改用户信息',
        params: UserParamsSchema,
        body: UserSchema.partial().refine((data) => Object.keys(data).length > 0, {
          message: '更新内容不能为空',
        }),
        response: { 200: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    generateUpdateHandler<Params['User'], Body['Update']>(fastify, {
      model: 'users',
      idKey: 'id',
      notFoundMessage: '用户不存在',
      uniqueMessage: '邮箱已经存在',
      additionalData: async (request) => ({
        password: await fastify.bcrypt.hash(request.body.password),
      }),
    })
  )

  // 删除用户
  fastify.delete<{
    Params: Params['User']
  }>(
    '/:id',
    {
      schema: {
        tags: ['user'],
        summary: '删除用户',
        description: '删除用户',
        params: UserParamsSchema,
        response: { 200: CustomResponseSchema },
      },
    },
    generateDeleteHandler<Params['User']>(fastify, {
      model: 'users',
      idKey: 'id',
      notFoundMessage: '用户不存在',
      successMessage: '用户已删除',
    })
  )
}
