import Fastify from 'fastify'
import path from 'path'
import autoload from '@fastify/autoload'
import { logger } from './constants/logger'
import { Prisma } from '@prisma/client'
import buildPrismaError from './utils/prisma/buildPrismaError'
import { DEFAULT_ERROR } from './constants/error'
import env from '@fastify/env'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { SWAGGER_OPTIONS, SWAGGER_UI_OPTIONS } from './constants/swagger'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import formbody from '@fastify/formbody'
import multer from 'fastify-multer'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import bcrypt from 'fastify-bcrypt'
import qs from 'fastify-qs'

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

fastify.register(env, {
  schema: {
    type: 'object',
    required: [
      'POSTGRES_DATABASE_URL',
      'CLICKHOUSE_DATABASE_URL',
      'REDIS_URL',
      'COOKIE_SECRET',
      'JWT_SECRET',
      'EMAIL_USER',
      'EMAIL_PASS',
    ],
    properties: {
      PORT: { type: 'number', default: 8080 },
      HOST: { type: 'string', default: '0.0.0.0' },
      POSTGRES_DATABASE_URL: { type: 'string' },
      CLICKHOUSE_DATABASE_URL: { type: 'string' },
      REDIS_URL: { type: 'string' },
      COOKIE_SECRET: { type: 'string' },
      JWT_SECRET: { type: 'string' },
      EMAIL_USER: { type: 'string' },
      EMAIL_PASS: { type: 'string' },
    },
  },
  dotenv: true,
})

fastify.setValidatorCompiler(validatorCompiler)
fastify.setSerializerCompiler(serializerCompiler)

fastify.register(swagger, SWAGGER_OPTIONS)

fastify.register(swaggerUi, SWAGGER_UI_OPTIONS)

fastify.register(formbody)
fastify.register(multer.contentParser)

fastify.register(cors, {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/',
})

fastify.register(bcrypt, {
  saltWorkFactor: 12,
})

fastify.register(qs)

fastify.register(autoload, {
  dir: path.join(__dirname, 'plugins'),
})

fastify.register(autoload, {
  dir: path.join(__dirname, 'routes'),
  options: {
    prefix: '/api',
  },
})

fastify.ready((err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.swagger()
})

export default fastify
