import { FastifyInstance } from 'fastify'
import { Role } from 'src/types/role'

type Params = Pick<Role, 'id'>

export default async function (fastify: FastifyInstance) {
  // 查询所有角色
  fastify.get('/', async (request, reply) => {
    try {
      const roles = await fastify.prisma.role.findMany()
      return reply.send(roles)
    } catch (error) {
      return reply.status(500).send({ message: 'Internal server error', error })
    }
  })

  // 查询指定 id 的角色
  fastify.get<{
    Params: Params
  }>('/:id', async (request, reply) => {
    const { id } = request.params
    const role = await fastify.prisma.role.findUnique({ where: { id: Number(id) } })

    if (!role) {
      return reply.status(404).send({ message: '角色不存在' })
    }

    return reply.send(role)
  })
}
