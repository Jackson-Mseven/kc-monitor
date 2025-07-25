import { MakeRequest, TransportResponse } from '../types'

export type DropReason = 'ratelimit_backoff' | 'queue_overflow' | 'network_error'

export interface CreateTransportOptions {
  /** 缓存区体积 */
  bufferSize?: number
  /** 判断是否被限流 */
  isRateLimited?: (category: string) => boolean
  /** 根据服务器返回修改限流条件 */
  updateRateLimits?: (response: TransportResponse) => void
  /** 从 payload 中解析记录类型 */
  getCategoryFromPayload?: (payload: string) => string
  /** 抛弃记录 */
  recordDroppedEvent?: (reason: DropReason, category: string) => void
  /** 是否调试 */
  debug?: boolean
}

const DEFAULT_MAX_BUFFER_SIZE = 64

/**
 * 创建 Transport 实例
 */
export function createTransport(options: CreateTransportOptions, makeRequest: MakeRequest) {
  /** 缓存区 */
  const buffer: (() => Promise<TransportResponse>)[] = []
  /** 最大缓存区体积 */
  const maxBufferSize = options.bufferSize ?? DEFAULT_MAX_BUFFER_SIZE

  /** 清空缓存区 */
  async function flush(): Promise<boolean> {
    while (buffer.length) {
      const task = buffer.shift()
      if (task) {
        try {
          await task()
        } catch {
          // swallow
        }
      }
    }
    return true
  }

  /** 发送 */
  function send(payload: string): Promise<TransportResponse> {
    console.log('payload---', payload)
    const category = options.getCategoryFromPayload?.(payload) ?? 'default'

    // 过滤被限流的数据
    if (options.isRateLimited?.(category)) {
      options.recordDroppedEvent?.('ratelimit_backoff', category)
      return Promise.resolve({})
    }

    // 执行请求
    const task = async (): Promise<TransportResponse> => {
      try {
        const response = await makeRequest({ payload })

        if (response.statusCode && (response.statusCode < 200 || response.statusCode >= 300)) {
          if (options.debug) {
            console.warn(`[Transport] Non-200 response: ${response.statusCode}`)
          }
        }

        options.updateRateLimits?.(response)
        return response
      } catch (error) {
        options.recordDroppedEvent?.('network_error', category)
        if (options.debug) {
          console.error('[Transport] Request failed', error)
        }
        throw error
      }
    }

    // 如果超出队列限制，
    if (buffer.length >= maxBufferSize) {
      if (options.debug) {
        console.error('[Transport] Buffer full, dropping event')
      }
      options.recordDroppedEvent?.('queue_overflow', category)
      return Promise.resolve({})
    }

    buffer.push(task)
    return task()
  }

  return {
    send,
    flush,
  }
}
