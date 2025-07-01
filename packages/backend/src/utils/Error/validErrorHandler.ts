import { CustomResponse } from '@kc-monitor/shared'
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

export default function validErrorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error?.validation) {
    const fieldErrors = error?.validation?.map((err) => err?.message).join(', ')
    return reply.sendResponse({
      code: 400,
      message: fieldErrors,
      error: 'Validation Error',
    })
  }
  return reply.sendDefaultError(error as unknown as CustomResponse)
}
