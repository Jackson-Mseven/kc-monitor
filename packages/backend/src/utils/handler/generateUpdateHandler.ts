import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { PrismaModelName } from 'src/types/prisma'
import buildPrismaError from '../prisma/buildPrismaError'

interface Options<P, B> {
  model: PrismaModelName
  idKey: keyof P
  notFoundMessage?: string
  uniqueMessage?: string
  additionalData?:
    | Partial<B>
    | ((request: FastifyRequest<{ Body: B }>, reply: FastifyReply) => Promise<Partial<B>>)
}

/**
 * 创建更新数据handler函数
 * @param fastify 实例
 * @param options 配置
 */
export default function <P, B>(fastify: FastifyInstance, options: Options<P, B>) {
  return async (request, reply) => {
    try {
      const data = await (fastify.prisma[options.model] as any).update({
        where: { id: Number(request.params[options.idKey] as P[keyof P]) },
        data: {
          ...request.body,
          ...(typeof options.additionalData === 'function'
            ? await options.additionalData(request, reply)
            : options.additionalData),
        } as B,
      })
      return reply.sendResponse({ data })
    } catch (error: any) {
      if (error.code === 'P2025') {
        const response = buildPrismaError(error.code, {
          message: options.notFoundMessage || '数据不存在',
        })
        return reply.sendResponse({ code: response?.code, ...response?.data })
      }
      if (error.code === 'P2002') {
        const response = buildPrismaError(error.code, {
          message: options.uniqueMessage || '数据已经存在',
        })
        return reply.sendResponse({ code: response?.code, ...response?.data })
      }
      return reply.sendDefaultError()
    }
  }
}
