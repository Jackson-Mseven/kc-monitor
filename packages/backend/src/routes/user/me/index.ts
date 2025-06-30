import {
  CustomResponseSchema,
  omit,
  UserUpdatePasswordSchema,
  UserUpdateSchema,
} from '@kc-monitor/shared'
import { FastifyInstance } from 'fastify'
import { User } from 'src/types/user'

interface Body {
  Update: Pick<User, 'name'>
  UpdatePassword: Pick<User, 'password'> & { newPassword: User['password'] }
}

export default async function (fastify: FastifyInstance) {
  // 获取当前登录用户信息
  fastify.get(
    '/',
    {
      schema: {
        tags: ['user'],
        summary: '获取当前登录用户信息',
        description: '获取当前登录用户的详细信息',
        response: { 200: CustomResponseSchema },
      },
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      const { id } = request.user

      const user = await fastify.prisma.users.findUnique({
        where: { id: Number(id) },
        include: {
          teams: true,
          team_roles: true,
        },
      })
      if (!user) {
        return reply.sendResponse({
          code: 404,
          message: '用户不存在',
        })
      }

      return reply.sendResponse({
        data: omit(user, ['password']),
      })
    }
  )

  // 更新当前登录用户信息
  fastify.put<{
    Body: Body['Update']
  }>(
    '/',
    {
      schema: {
        tags: ['user'],
        summary: '更新当前登录用户信息',
        description: '更新当前登录用户的详细信息',
        body: UserUpdateSchema,
        response: { 200: CustomResponseSchema },
      },
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      const { id } = request.user
      const { name } = request.body
      const user = await fastify.prisma.users.update({
        where: { id: Number(id) },
        data: { name },
      })
      return reply.sendResponse({
        data: user,
        message: '更新成功',
      })
    }
  )

  // 更新当前登录用户密码
  fastify.put<{
    Body: Body['UpdatePassword']
  }>(
    '/password',
    {
      schema: {
        tags: ['user'],
        summary: '更新当前登录用户密码',
        description: '更新当前登录用户的密码',
        body: UserUpdatePasswordSchema,
        response: { 200: CustomResponseSchema },
      },
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
