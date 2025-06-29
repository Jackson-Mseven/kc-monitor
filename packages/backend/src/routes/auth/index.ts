import { FastifyInstance } from 'fastify'
import {
  CustomResponseSchema,
  SendCodeSchema,
  LoginSchema,
  RegisterSchema,
  ForgetPasswordSchema,
  ResetPasswordSchema,
  pick,
  CodeTypeValues,
} from '@kc-monitor/shared'
import { User } from 'src/types/user'
import buildErrorByCode from 'src/utils/error/buildErrorByCode'
import validErrorHandler from 'src/utils/error/validErrorHandler'
import buildError from 'src/utils/prisma/buildPrismaError'
import { JwtPayload } from 'src/types/jwt'

interface Body {
  Login: Pick<User, 'email' | 'password'>
  Register: Pick<User, 'name' | 'email' | 'password'> & { code: string }
  SendCode: Pick<User, 'email'> & { type: CodeTypeValues }
  ForgetPassword: Pick<User, 'email'>
  ResetPassword: { token: string; newPassword: string }
}

const transformUserToJwtPayload = (user: User): JwtPayload => {
  return {
    ...pick(user, ['id', 'email']),
    username: user.name,
  }
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
        body: LoginSchema,
        response: { 200: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      const { email, password } = request.body

      const user = await fastify.prisma.users.findUnique({
        where: { email },
      })

      if (!user) {
        return reply.sendResponse({ ...buildErrorByCode(404), message: '用户不存在' })
      }

      const isPasswordCorrect = await fastify.bcrypt.compare(password, user.password)

      if (!isPasswordCorrect) {
        return reply.sendResponse({ ...buildErrorByCode(401), message: '密码错误' })
      }

      const token = fastify.jwt.sign(transformUserToJwtPayload(user), {
        expiresIn: '7d',
      })

      reply.setCookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      })

      return reply.sendResponse({
        message: '登录成功',
        data: {
          ...pick(user, ['id', 'name', 'email']),
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
        body: RegisterSchema,
        response: { 201: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      const { name, email, password, code } = request.body

      const savedCode = await fastify.redis.get(`verify:email:register:${email}`)

      if (!savedCode || savedCode !== code) {
        return reply.sendResponse({ ...buildErrorByCode(400), message: '无效或过期的验证码' })
      }

      const existingUser = await fastify.prisma.users.findUnique({
        where: { email },
      })
      if (existingUser) {
        return reply.sendResponse({ ...buildErrorByCode(409), message: '邮箱已被注册' })
      }

      try {
        const hashedPassword = await fastify.bcrypt.hash(password)
        const user = await fastify.prisma.users.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        })

        const token = fastify.jwt.sign(transformUserToJwtPayload(user), {
          expiresIn: '7d',
        })

        reply.setCookie('token', token, {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60,
        })

        await fastify.redis.del(`verify:email:${email}`)

        return reply.sendResponse({
          code: 201,
          message: '注册成功',
          data: {
            ...pick(user, ['id', 'name', 'email']),
            token,
          },
        })
      } catch (error: any) {
        if (error.code === 'P2002') {
          const response = buildError(error.code, {
            message: '用户已存在',
          })
          return reply.sendResponse({ code: response?.code, ...response?.data })
        }
        return reply.sendDefaultError()
      }
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
      reply.clearCookie('token', { path: '/', httpOnly: true, secure: false, sameSite: 'lax' })

      return reply.sendResponse({
        message: '退出成功',
      })
    }
  )

  // 发送验证码
  fastify.post<{
    Body: Body['SendCode']
  }>(
    '/send-code',
    {
      schema: {
        tags: ['auth'],
        summary: '发送验证码',
        description: '发送验证码到用户邮箱',
        body: SendCodeSchema,
        response: { 200: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      const { email, type } = request.body

      // 线上环境限制发送频率
      if (process.env.NODE_ENV === 'production') {
        const limitKey = `verify:limit:${type}:${email}`
        const count = await fastify.redis.incr(limitKey)
        if (count === 1) {
          await fastify.redis.expire(limitKey, 60 * 60 * 24)
        }
        if (count > 5) {
          return reply.code(429).send({ message: '发送频率过高' })
        }
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString()

      await fastify.mailer.sendMail({
        from: `"${process.env.PROJECT_NAME}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `${process.env.PROJECT_NAME} 验证码`,
        text: `您的验证码是: ${code}`,
      })

      await fastify.redis.set(`verify:email:${type}:${email}`, code, 'EX', 60 * 5)

      return reply.sendResponse({
        message: '验证码发送成功',
      })
    }
  )

  // 忘记密码接口
  fastify.post<{
    Body: Body['ForgetPassword']
  }>(
    '/forgot-password',
    {
      schema: {
        tags: ['auth'],
        summary: '忘记密码',
        description: '通过邮箱验证码重置密码',
        body: ForgetPasswordSchema,
        response: { 200: CustomResponseSchema },
      },
      errorHandler: validErrorHandler,
    },
    async (request, reply) => {
      const { email } = request.body

      const user = await fastify.prisma.users.findUnique({ where: { email } })
      if (!user) {
        return reply.send({ message: '邮箱不存在' })
      }

      const token = fastify.jwt.sign(transformUserToJwtPayload(user), {
        expiresIn: '15m',
      })

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

      await fastify.mailer.sendMail({
        from: `"${process.env.PROJECT_NAME}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '重置密码链接',
        html: `<p>点击以下链接重置密码，15分钟内有效：</p>
               <a href="${resetLink}">${resetLink}</a>`,
      })

      return reply.sendResponse({
        message: '密码重置邮件已发送',
      })
    }
  )

  // 重置密码接口
  fastify.post<{ Body: Body['ResetPassword'] }>(
    '/reset-password',
    {
      schema: {
        tags: ['auth'],
        summary: '重置密码',
        description: '通过邮箱验证码重置密码',
        body: ResetPasswordSchema,
        response: { 200: CustomResponseSchema },
      },
    },
    async (request, reply) => {
      const { token, newPassword } = request.body

      try {
        const payload = fastify.jwt.verify(token) satisfies { id: string }

        const hashed = await fastify.bcrypt.hash(newPassword)

        await fastify.prisma.users.update({
          where: { id: Number(payload.id) },
          data: { password: hashed },
        })

        return reply.sendResponse({ message: '密码已重置成功' })
      } catch (error) {
        return reply.sendResponse({ ...buildErrorByCode(400), message: '链接无效或已过期' })
      }
    }
  )
}
