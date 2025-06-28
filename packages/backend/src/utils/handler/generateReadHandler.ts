import { FastifyInstance } from 'fastify'
import { PrismaModelName } from 'src/types/prisma'

interface Options {
  model: PrismaModelName
}

/**
 * 创建获取所有数据handler函数
 * @param fastify 实例
 * @param options 配置
 */
export default function (fastify: FastifyInstance, options: Options) {
  return async (request, reply) => {
    const data = await (fastify.prisma[options.model] as any).findMany()
    return reply.sendResponse({ data })
  }
}
