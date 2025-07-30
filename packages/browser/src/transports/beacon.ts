import { MakeRequest } from '@kc-monitor/core'

/**
 * beacon 请求
 */
export const beaconRequest: MakeRequest = ({ payload }) => {
  const success = navigator.sendBeacon?.('/report', payload)
  return success
    ? Promise.resolve({ statusCode: 200 })
    : Promise.reject(new Error('sendBeacon failed'))
}
