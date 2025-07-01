import { FastifyPluginCallback, FastifyReply } from 'fastify'
import { CustomResponse } from '../../types/response'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyReply {
    sendDefaultError(options?: Partial<CustomResponse>): void
  }
}

const sendDefaultErrorPlugin: FastifyPluginCallback = (fastify) => {
  fastify.decorateReply(
    'sendDefaultError',
    function (this: FastifyReply, options: Partial<CustomResponse>) {
      console.log('options---', options)

      const response: CustomResponse = {
        code: options?.code ?? 500,
        message: options?.message ?? 'Internal server error',
        data: options?.data ?? null,
        error: options?.error ?? 'InternalServerError',
      }
      if (options?.meta !== undefined) {
        response.meta = options?.meta
      }
      this.status(options?.code ?? 500).send(response)
    }
  )
}

export default fp(sendDefaultErrorPlugin)
