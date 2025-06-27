import fp from 'fastify-plugin'
import cookie from '@fastify/cookie'

export default fp(async (fastify) => {
  fastify.register(cookie, {
    secret: process.env.COOKIE_SECRET!,
  })
})
