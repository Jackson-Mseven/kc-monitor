import { FastifyInstance } from 'fastify'
import { PrismaModelName } from 'src/types/prisma'
import buildPrismaError from '../prisma/buildPrismaError'

interface Options<P> {
  model: PrismaModelName
  idKey: keyof P
  notFoundMessage?: string
  successMessage?: string
}

/**
 * 创建删除数据handler函数
 * @param fastify 实例
 * @param options 配置
 */
export default function <P>(fastify: FastifyInstance, options: Options<P>) {
  return async (request, reply) => {
    try {
      await (fastify.prisma[options.model] as any).delete({
        where: { id: Number(request.params[options.idKey] as P[keyof P]) },
      })
      return reply.sendResponse({ message: options.successMessage || '数据已删除' })
    } catch (error: any) {
      if (error.code === 'P2025') {
        const response = buildPrismaError(error.code, {
          message: options.notFoundMessage || '数据不存在',
        })
        return reply.sendResponse({ code: response?.code, ...response?.data })
      }
      return reply.sendDefaultError()
    }
  }
}
