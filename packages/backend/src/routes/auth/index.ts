import { FastifyInstance } from 'fastify'
import { EmailSchema, PasswordSchema, UserSchema } from 'src/schema/user'
import { CustomResponseSchema } from 'src/schemas/response'
import { User } from 'src/types/user'
import buildErrorByCode from 'src/utils/Error/buildErrorByCode'
import validErrorHandler from 'src/utils/Error/validErrorHandler'
import pick from 'src/utils/pick'
import buildError from 'src/utils/prisma/buildError'
import { z } from 'zod'

interface Body {
  Login: Pick<User, 'email' | 'password'>
  Register: Pick<User, 'username' | 'email' | 'password'>
}

export default async function (fastify: FastifyInstance) {
  // 用户登录接口
  fastify.post<{
    Body: Body['Login']
  }>(
    '/login',
    {
      schema: {
        tags: ['auth'],
        summary: '用户登录',
        description: '通过邮箱和密码登录',
        body: z.object({
          email: EmailSchema,
          password: PasswordSchema,
        }),
        response: { 200: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      const { email, password } = request.body

      const user = await fastify.prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '用户不存在' })
      }

      const isPasswordCorrect = await fastify.bcrypt.compare(password, user.password)
      if (!isPasswordCorrect) {
        return reply.sendResponse({ ...buildErrorByCode(401), message: '密码错误' })
      }

      return reply.sendResponse({
        message: '登录成功',
        data: pick(user, ['id', 'username', 'email']),
      })
    }
  )

  // 用户注册
  fastify.post<{
    Body: Body['Register']
  }>(
    '/register',
    {
      schema: {
        tags: ['auth'],
        summary: '用户注册',
        description: '通过用户名、邮箱和密码注册新用户',
        body: UserSchema,
        response: { 201: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      const { username, email, password } = request.body

      const existingUser = await fastify.prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return reply.sendResponse({ ...buildErrorByCode(409), message: '邮箱已被注册' })
      }

      try {
        const hashedPassword = await fastify.bcrypt.hash(password)

        const user = await fastify.prisma.user.create({
          data: {
            username,
            email,
            password: hashedPassword,
          },
        })

        return reply.sendResponse({
          code: 201,
          message: '注册成功',
          data: pick(user, ['id', 'username', 'email']),
        })
      } catch (error: any) {
        if (error.code === 'P2002') {
          const response = buildError(error.code, {
            message: '用户已存在',
          })
          return reply.sendResponse({ code: response?.code as number, ...response?.data })
        }
        return reply.sendDefaultError()
      }
    }
  )
}
