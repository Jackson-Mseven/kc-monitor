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
      getCategoryFromPayload: (payload) => {
        return JSON.parse(payload).type || 'default'
      },
      recordDroppedEvent: (type, options) => {
        console.log(`[Dropped] ${type} in category ${options.category}`)
      },
    },
    supportBeacon ? beaconRequest : fetchRequest
  )
