import fp from 'fastify-plugin'
import Redis from 'ioredis'

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis
  }
}

export default fp(async (fastify) => {
  const client = new Redis(process.env.REDIS_URL!)

  client.on('error', (err) => {
    fastify.log.error('Redis error:', err)
  })

  fastify.decorate('redis', client)

  fastify.addHook('onClose', async () => {
    await client.quit()
  })
})
