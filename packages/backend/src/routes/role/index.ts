import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CustomResponseSchema } from '@kc-monitor/schema'
import { Role } from 'src/types/role'
import { z } from 'zod'

type Params = Pick<Role, 'id'>

export default async function (fastify: FastifyInstance) {
  // 查询所有角色
  fastify.get(
    '/',
    {
      schema: {
        tags: ['role'],
        summary: '查询所有角色',
        description: '查询所有角色',
        security: [{ apiKey: [] }],
        response: {
          200: CustomResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const roles = await fastify.prisma.role.findMany()
      return reply.sendResponse({ data: roles })
    }
  )

  // 查询指定 id 的角色
  fastify.withTypeProvider<ZodTypeProvider>().get<{
    Params: Params
  }>(
    '/:id',
    {
      schema: {
        tags: ['role'],
        summary: '查询指定 id 的角色',
        description: '查询指定 id 的角色',
        security: [{ apiKey: [] }],
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: CustomResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const role = await fastify.prisma.role.findUnique({ where: { id: Number(id) } })
      if (!role) {
        return reply.sendResponse({ code: 404, message: '角色不存在' })
      }
      return reply.sendResponse({ data: role })
    }
  )
}
