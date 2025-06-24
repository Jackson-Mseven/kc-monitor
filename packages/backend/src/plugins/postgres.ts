import fp from 'fastify-plugin'
import fastifyPostgres from '@fastify/postgres'
import { FastifyPluginAsync } from 'fastify'

const postgresPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifyPostgres, {
    connectionString:
      process.env.DATABASE_URL || 'postgres://admin@admin.com:admin123@localhost:5432/postgres',
  })
}

export default fp(postgresPlugin)
