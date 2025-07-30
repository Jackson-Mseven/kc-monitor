import { MakeRequest } from '@kc-monitor/core'

/**
 * fetch 请求
 */
export const fetchRequest: MakeRequest = async ({ payload }) => {
  await fetch('/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  })
  return { statusCode: 200 }
}
