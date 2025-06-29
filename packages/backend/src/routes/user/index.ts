import { FastifyInstance } from 'fastify'
import { User } from 'src/types/user'
import {
  UserSchema,
  CustomResponseSchema,
  UserParamsSchema,
  UserUpdateSchema,
  UserUpdatePasswordSchema,
} from '@kc-monitor/shared'
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
  UpdatePassword: { password: string; newPassword: string }
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
        params: UserParamsSchema,
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
        body: UserUpdateSchema,
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
        password: request.body.password
          ? await fastify.bcrypt.hash(request.body.password)
          : undefined,
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

  // 修改用户密码
  fastify.put<{
    Body: Body['UpdatePassword']
  }>(
    '/update-password',
    {
      schema: {
        tags: ['user'],
        summary: '修改用户密码',
        description: '修改用户密码',
        body: UserUpdatePasswordSchema,
        response: { 200: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      const { id } = request.user
      const { password, newPassword } = request.body

      const user = await fastify.prisma.users.findUnique({ where: { id: Number(id) } })
      if (!user) {
        return reply.sendResponse({
          code: 404,
          message: '用户不存在',
        })
      }

      const isPasswordValid = await fastify.bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return reply.sendResponse({
          code: 400,
          message: '当前密码错误',
        })
      }

      const hashedNewPassword = await fastify.bcrypt.hash(newPassword)

      await fastify.prisma.users.update({
        where: { id: Number(id) },
        data: { password: hashedNewPassword },
      })

      reply.clearCookie('token', { path: '/', httpOnly: true, secure: false, sameSite: 'lax' })

      return reply.sendResponse({
        message: '密码修改成功，请重新登录',
      })
    }
  )
}
