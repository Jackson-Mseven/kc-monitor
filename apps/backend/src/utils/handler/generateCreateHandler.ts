import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { PrismaModelName } from 'src/types/prisma'
import buildPrismaError from '../prisma/buildPrismaError'

interface Options<B> {
  model: PrismaModelName
  uniqueMessage?: string
  additionalData?:
    | Partial<B>
    | ((request: FastifyRequest<{ Body: B }>, reply: FastifyReply) => Promise<Partial<B>>)
}

/**
 * 创建创建数据handler函数
 * @param fastify 实例
 * @param options 配置
 */
export default function <B>(fastify: FastifyInstance, options: Options<B>) {
  return async (request, reply) => {
    try {
      const data = await (fastify.prisma[options.model] as any).create({
        data: {
          ...request.body,
          ...(typeof options.additionalData === 'function'
            ? await options.additionalData(request, reply)
            : options.additionalData),
        } as B,
      })
      return reply.sendResponse({ code: 201, data })
    } catch (error: any) {
      if (error.code === 'P2002') {
        const response = buildPrismaError(error.code, {
          message: options.uniqueMessage || '数据已存在',
        })
        return reply.sendResponse({ code: response?.code, ...response?.data })
      }
      return reply.sendDefaultError()
    }
  }
}
