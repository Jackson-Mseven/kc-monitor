import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'
import { FastifyRequest } from 'fastify'
import buildErrorByCode from 'src/utils/Error/buildErrorByCode'
import { JwtPayload } from 'src/types/jwt'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest) => Promise<void>
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
    secret: process.env.JWT_SECRET as string,
    cookie: {
      cookieName: 'token',
      signed: false,
    },
  })

  fastify.decorate('authenticate', async (request: FastifyRequest) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      throw buildErrorByCode(401)
    }
  })
})
