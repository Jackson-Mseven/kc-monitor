import { FastifyInstance } from 'fastify'
import { User } from 'src/types/user'

type Params = Pick<User, 'id'>
type Querystring = Pick<User, 'username' | 'password' | 'email'>

export default async function (fastify: FastifyInstance) {
  // 获取所有用户
  fastify.get('/', async (request, reply) => {
    try {
      const users = await fastify.prisma.user.findMany()
      return reply.send(users)
    } catch (error) {
      return reply.status(500).send({ message: 'Internal server error', error })
    }
  })

  // 获取单个用户
  fastify.get<{
    Params: Params
  }>('/:id', async (request, reply) => {
    const { id } = request.params
    const user = await fastify.prisma.user.findUnique({ where: { id: Number(id) } })

    if (!user) {
      return reply.status(404).send({ message: '用户不存在' })
    }

    return reply.send(user)
  })

  // 新增用户
  fastify.post<{
    Querystring: Querystring
  }>('/', async (request, reply) => {
    const { username, password, email } = request.query
    if (!username || !password || !email) {
      return reply.status(400).send({ message: '缺少必须的参数' })
    }

    try {
      const user = await fastify.prisma.user.create({
        data: request.query,
      })
      return reply.status(201).send(user)
    } catch (error: any) {
      if (error.code === 'P2002') {
        return reply.status(409).send({ message: '邮箱已经存在' })
      }
      return reply.status(500).send({ message: 'Internal server error' })
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
      return reply.status(400).send({ message: '没有要更新的字段' })
    }

    try {
      const user = await fastify.prisma.user.update({
        where: { id: Number(id) },
        data: request.query,
      })
      return reply.send(user)
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.status(404).send({ message: '用户不存在' })
      }
      if (error.code === 'P2002') {
        return reply.status(409).send({ message: '邮箱已经存在' })
      }
      return reply.status(500).send({ message: 'Internal server error' })
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
      return reply.send({ message: '用户已删除' })
    } catch (error: any) {
      if (error.code === 'P2025') {
        return reply.status(404).send({ message: '用户不存在' })
      }
      return reply.status(500).send({ message: 'Internal server error' })
    }
  })
}
