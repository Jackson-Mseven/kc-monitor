import { createTransport } from '@kc-monitor/core'
import { fetchRequest } from './fetch'
import { supportBeacon } from '../constants/supportBeacon'
import { beaconRequest } from './beacon'

/**
 * 创建浏览器 Transport 实例
 */
export const createBrowserTransport = () =>
  createTransport(
    {
      bufferSize: 32,
      debug: true,
      getCategoryFromPayload: (payload) => {
        const parsed = JSON.parse(payload)
        return parsed.type || 'default'
      },
      recordDroppedEvent: (reason, category) => {
        console.log(`[Dropped] ${reason} in category ${category}`)
      },
    },
    supportBeacon ? beaconRequest : fetchRequest
  )
