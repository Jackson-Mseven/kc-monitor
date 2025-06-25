import { FastifyInstance } from 'fastify'
import { User } from 'src/types/user'
import buildError from 'src/utils/prisma/buildError'

type Params = Pick<User, 'id'>
type Querystring = Pick<User, 'username' | 'password' | 'email'>

export default async function (fastify: FastifyInstance) {
  // 获取所有用户
  fastify.get('/', async (request, reply) => {
    const users = await fastify.prisma.user.findMany()
    return reply.sendResponse({ data: users })
  })

  // 获取单个用户
  fastify.get<{
    Params: Params
  }>('/:id', async (request, reply) => {
    const { id } = request.params
    const user = await fastify.prisma.user.findUnique({ where: { id: Number(id) } })
    if (!user) {
      return reply.sendResponse({ code: 404, message: '用户不存在' })
    }
    return reply.sendResponse({ data: user })
  })

  // 新增用户
  fastify.post<{
    Querystring: Querystring
  }>('/', async (request, reply) => {
    const { username, password, email } = request.query
    if (!username || !password || !email) {
      console.log(reply.sendResponse)

      return reply.sendResponse({ code: 400, message: '缺少必须的参数' })
    }

    try {
      const user = await fastify.prisma.user.create({
        data: request.query,
      })
      console.log(user)
      console.log(reply.sendResponse)
      return reply.sendResponse({ code: 201, data: user })
    } catch (error: any) {
      if (error.code === 'P2002') {
        const response = buildError(error.code, {
          message: '邮箱已经存在',
        })
        console.log(response)
        console.log(reply.sendResponse)
        return reply.sendResponse({ code: response?.code as number, ...response?.data })
      }
      console.log(error)
      console.log(reply.sendDefaultError)
      return reply.sendDefaultError()
    }
  })

  // 修改用户信息
  fastify.put<{
    Params: Params
    Querystring: Querystring
  }>('/:id', async (request, reply) => {
    const { id } = request.params
    const { username, password, email } = request.query

    if (!username && !password && !email) {
      return reply.sendResponse({ code: 400, message: '没有要更新的字段' })
    }

    try {
      const user = await fastify.prisma.user.update({
        where: { id: Number(id) },
        data: request.query,
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
  })

  // 删除用户
  fastify.delete<{
    Params: Params
  }>('/:id', async (request, reply) => {
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
  })
}
