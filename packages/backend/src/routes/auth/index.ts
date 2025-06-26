import { FastifyInstance } from 'fastify'
import { EmailSchema, PasswordSchema, UserSchema, CustomResponseSchema } from '@kc-monitor/schema'
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

      const token = fastify.jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        {
          expiresIn: '7d',
        }
      )
      console.log('token---', token)

      reply.setCookie('token', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60,
      })

      return reply.sendResponse({
        message: '登录成功',
        data: {
          ...pick(user, ['id', 'username', 'email']),
          token,
        },
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

        const token = fastify.jwt.sign(
          {
            id: user.id,
            email: user.email,
            username: user.username,
          },
          {
            expiresIn: '7d',
          }
        )

        reply.setCookie('token', token, {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60,
        })

        return reply.sendResponse({
          code: 201,
          message: '注册成功',
          data: {
            ...pick(user, ['id', 'username', 'email']),
            token,
          },
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

  // 获取当前登录用户信息
  fastify.get(
    '/me',
    {
      schema: {
        tags: ['auth'],
        summary: '获取当前登录用户信息',
        description: '获取当前登录用户的详细信息',
        response: { 200: CustomResponseSchema },
      },
      preValidation: fastify.authenticate,
    },
    async (request, reply) => {
      const userId = request.user.id

      const user = await fastify.prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '用户不存在' })
      }

      return reply.sendResponse({
        message: '获取成功',
        data: pick(user, ['id', 'username', 'email', 'created_at']),
      })
    }
  )

  // 退出登录
  fastify.post(
    '/logout',
    {
      schema: {
        tags: ['auth'],
        summary: '退出登录',
        description: '清除用户登录状态',
        response: { 200: CustomResponseSchema },
      },
    },
    async (request, reply) => {
      reply.clearCookie('token', { path: '/' })

      return reply.sendResponse({
        message: '退出成功',
      })
    }
  )
}
