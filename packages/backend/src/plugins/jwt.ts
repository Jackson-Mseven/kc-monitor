import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'
import buildErrorByCode from 'src/utils/Error/buildErrorByCode'
import { JwtPayload } from 'src/types/jwt'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }

  interface FastifyRequest {
    user: JwtPayload
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload
    user: JwtPayload
  }
}

export default fp(async (fastify) => {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET!,
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  })

  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify()
    } catch (error: any) {
      return reply.send({ ...buildErrorByCode(401), data: null, message: '请先登录' })
    }
  })
})
