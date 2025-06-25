import Fastify from 'fastify'
import path from 'path'
import autoload from '@fastify/autoload'
import { logger } from './constants/logger'
import { Prisma } from '@prisma/client'
import buildPrismaError from './utils/prisma/buildError'
import { DEFAULT_ERROR } from './constants/error'

const fastify = Fastify({
  logger,
})

fastify.setErrorHandler(function (error, request, reply) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = buildPrismaError(error.code)
    if (prismaError) {
      reply.status(prismaError.code).send({
        error: prismaError.data.error,
        message: prismaError.data.message,
      })
    }
  }

  // 其他类型错误，返回 500
  reply.status(error.statusCode ?? DEFAULT_ERROR.CODE).send({
    error: error.name || DEFAULT_ERROR.DATA.ERROR,
    message: error.message || DEFAULT_ERROR.DATA.MESSAGE,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  })
})

fastify.register(autoload, {
  dir: path.join(__dirname, 'plugins'),
  maxDepth: 999,
})

fastify.register(autoload, {
  dir: path.join(__dirname, 'routes'),
})

export default fastify
