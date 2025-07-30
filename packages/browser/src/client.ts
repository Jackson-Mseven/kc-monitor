import { MonitorClient } from '@kc-monitor/core'
import type { MonitorOptions } from '@kc-monitor/core'

export class BrowserClient extends MonitorClient {
  constructor(options: MonitorOptions) {
    super(options)
  }
}
