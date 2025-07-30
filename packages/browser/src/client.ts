import { MonitorClient } from '@kc-monitor/core'
import type { ClientOptions } from '@kc-monitor/core'

/** 浏览器端客户端 */
export class BrowserClient extends MonitorClient {
  constructor(options: ClientOptions) {
    super(options)
  }
}
