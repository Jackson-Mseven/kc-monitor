import { FastifyPluginCallback, FastifyReply } from 'fastify'
import { CustomResponse } from '../../types/response'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyReply {
    sendResponse(payload?: Partial<CustomResponse>): void
  }
}

const sendResponsePlugin: FastifyPluginCallback = (fastify) => {
  fastify.decorateReply(
    'sendResponse',
    function (
      this: FastifyReply,
      {
        code = 200,
        message = 'success',
        data = null,
        error = null,
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

export default fp(sendResponsePlugin)
