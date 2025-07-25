import fp from 'fastify-plugin'
import fastifyPostgres from '@fastify/postgres'
import { FastifyPluginAsync } from 'fastify'

const postgresPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifyPostgres, {
    connectionString: process.env.POSTGRES_DATABASE_URL,
  })
}

export default fp(postgresPlugin)
