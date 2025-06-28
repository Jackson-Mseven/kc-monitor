import { FastifyInstance } from 'fastify'
import { PrismaModelName } from 'src/types/prisma'

interface Options<P> {
  model: PrismaModelName
  idKey: keyof P
  notFoundMessage?: string
}

/**
 * 创建获取单个数据handler函数
 * @param fastify 实例
 * @param options 配置
 */
export default function <P>(fastify: FastifyInstance, options: Options<P>) {
  return async (request, reply) => {
    const data = await (fastify.prisma[options.model] as any).findUnique({
      where: { id: Number(request.params[options.idKey]) },
    })
    if (!data) {
      return reply.sendResponse({ code: 404, message: options.notFoundMessage || '数据不存在' })
    }
    return reply.sendResponse({ data })
  }
}
