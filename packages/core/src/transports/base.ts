import { isProduction } from '../hub'
import type { MakeRequest, TransportResponse } from '../types'

const DROP_TYPE = {
  QUEUE_OVERFLOW: 'queue_overflow',
  NETWORK_ERROR: 'network_error',
} as const

type DropReason = (typeof DROP_TYPE)[keyof typeof DROP_TYPE]

interface CreateTransportOptions {
  /** 缓存区体积 */
  bufferSize?: number
  /** 从事件中解析记录类型 */
  getCategoryFromPayload?: (payload: string) => string
  /** 处理被抛弃的事件 */
  recordDroppedEvent?: (type: DropReason, options: { category: string; payload: string }) => void
}

/**
 * 创建 Transport 实例
 */
export function createTransport(options: CreateTransportOptions, makeRequest: MakeRequest) {
  /**
   * 调用传入的 makeRequest 函数，发送请求
   * @param payload 要发送的 payload
   * @returns 发送请求的 Promise
   */
  async function send(payload: string): Promise<TransportResponse> {
    const category = options.getCategoryFromPayload?.(payload) ?? 'default'

    try {
      if (!isProduction()) {
        console.info('[Transport]', payload)
        return Promise.resolve({})
      }
      return await makeRequest({ payload })
    } catch (error: unknown) {
      options.recordDroppedEvent?.(DROP_TYPE.NETWORK_ERROR, { category, payload })
      return { statusCode: 500, error: error as Error }
    }
  }

  return {
    send,
  }
}
