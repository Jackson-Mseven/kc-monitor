/**
 * 根据错误码构建错误对象
 * @param code 错误码
 * @returns 错误对象
 */
export default function buildErrorByCode(code: number) {
  const errorMessages: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
  }

  return {
    code,
    error: errorMessages[code] ?? 'Unknown Error',
  }
}
