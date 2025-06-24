import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'
import { FastifyPluginAsync } from 'fastify'
import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const globalForPrisma = global as unknown as { prisma?: PrismaClient }
const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('prisma', prisma)
}

export default fp(prismaPlugin)
