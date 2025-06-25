import { FastifyPluginCallback, FastifyReply } from 'fastify'
import { CustomResponse } from '../../types/response'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyReply {
    sendDefaultError(payload?: Partial<CustomResponse>): void
  }
}

const sendDefaultErrorPlugin: FastifyPluginCallback = (fastify) => {
  fastify.decorateReply(
    'sendDefaultError',
    function (
      this: FastifyReply,
      {
        code = 500,
        message = 'Internal server error',
        error = 'InternalServerError',
        data = null,
        meta = undefined,
      }: Partial<CustomResponse>
    ) {
      const response: CustomResponse = {
        code,
        message,
        data,
        error,
      }
      if (meta !== undefined) {
        response.meta = meta
      }
      this.status(code).send(response)
    }
  )
}

export default fp(sendDefaultErrorPlugin)
