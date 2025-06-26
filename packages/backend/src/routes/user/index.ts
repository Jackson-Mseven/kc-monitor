import { FastifyInstance } from 'fastify'
import { User } from 'src/types/user'
import buildError from 'src/utils/prisma/buildError'
import { UserSchema, CustomResponseSchema } from '@kc-monitor/schema'
import { z } from 'zod'
import validErrorHandler from 'src/utils/Error/validErrorHandler'

type Params = Pick<User, 'id'>
type Body = Pick<User, 'username' | 'password' | 'email'>

export default async function (fastify: FastifyInstance) {
  // 获取所有用户
  fastify.get(
    '/',
    {
      schema: {
        tags: ['user'],
        summary: '获取所有用户',
        description: '获取所有用户',
        security: [{ apiKey: [] }],
        response: { 200: CustomResponseSchema },
      },
    },
    async (request, reply) => {
      const users = await fastify.prisma.user.findMany()
      return reply.sendResponse({ data: users })
    }
  )

  // 获取单个用户
  fastify.get<{
    Params: Params
  }>(
    '/:id',
    {
      schema: {
        tags: ['user'],
        summary: '获取单个用户',
        description: '获取单个用户',
        security: [{ apiKey: [] }],
        params: z.object({
          id: z.string(),
        }),
        response: { 200: CustomResponseSchema },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const user = await fastify.prisma.user.findUnique({ where: { id: Number(id) } })
      if (!user) {
        return reply.sendResponse({ code: 404, message: '用户不存在' })
      }
      return reply.sendResponse({ data: user })
    }
  )

  // 新增用户
  fastify.post<{
    Body: Body
  }>(
    '/',
    {
      schema: {
        tags: ['user'],
        summary: '新增用户',
        description: '新增用户',
        security: [{ apiKey: [] }],
        body: UserSchema,
        response: { 201: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      try {
        const hashedPassword = await fastify.bcrypt.hash(request.body.password)
        const user = await fastify.prisma.user.create({
          data: {
            ...request.body,
            password: hashedPassword,
          },
        })
        return reply.sendResponse({ code: 201, data: user })
      } catch (error: any) {
        if (error.code === 'P2002') {
          const response = buildError(error.code, {
            message: '邮箱已经存在',
          })
          return reply.sendResponse({ code: response?.code as number, ...response?.data })
        }
        return reply.sendDefaultError()
      }
    }
  )

  // 修改用户信息
  fastify.put<{
    Params: Params
    Body: Body
  }>(
    '/:id',
    {
      schema: {
        tags: ['user'],
        summary: '修改用户信息',
        description: '修改用户信息',
        security: [{ apiKey: [] }],
        params: z.object({
          id: z.string(),
        }),
        body: UserSchema.partial().refine((data) => Object.keys(data).length > 0, {
          message: '没有要更改的用户数据',
        }),
        response: { 200: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      const { id } = request.params
      try {
        const updateData = request.body
        if (request.body.password) {
          updateData.password = await fastify.bcrypt.hash(request.body.password)
        }
        const user = await fastify.prisma.user.update({
          where: { id: Number(id) },
          data: updateData,
        })
        return reply.sendResponse({ data: user })
      } catch (error: any) {
        if (error.code === 'P2025') {
          const response = buildError(error.code, {
            message: '用户不存在',
          })
          return reply.sendResponse({ code: response?.code as number, ...response?.data })
        }
        if (error.code === 'P2002') {
          const response = buildError(error.code, {
            message: '邮箱已经存在',
          })
          return reply.sendResponse({ code: response?.code as number, ...response?.data })
        }
        return reply.sendDefaultError()
      }
    }
  )

  // 删除用户
  fastify.delete<{
    Params: Params
  }>(
    '/:id',
    {
      schema: {
        tags: ['user'],
        summary: '删除用户',
        description: '删除用户',
        security: [{ apiKey: [] }],
        params: z.object({
          id: z.string(),
        }),
        response: { 200: CustomResponseSchema },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      try {
        await fastify.prisma.user.delete({
          where: { id: Number(id) },
        })
        return reply.sendResponse({ message: '用户已删除' })
      } catch (error: any) {
        if (error.code === 'P2025') {
          const response = buildError(error.code, {
            message: '用户不存在',
          })
          return reply.sendResponse({ code: response?.code as number, ...response?.data })
        }
        return reply.sendDefaultError()
      }
    }
  )
}
