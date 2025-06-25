import { FastifyPluginAsync } from 'fastify'
import { createClient } from '@clickhouse/client'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyInstance {
    clickhouse: ReturnType<typeof createClient>
  }
}

const clickhousePlugin: FastifyPluginAsync = async (fastify) => {
  const client = createClient({
    host: process.env.CLICKHOUSE_DATABASE_URL,
    username: 'default',
    password: '',
    database: 'monitor',
  })

  try {
    await client.ping()
    fastify.log.info('ClickHouse connected')
  } catch (err) {
    fastify.log.error('ClickHouse connection error:', err)
    throw err
  }

  fastify.decorate('clickhouse', client)
}

export default fp(clickhousePlugin)
