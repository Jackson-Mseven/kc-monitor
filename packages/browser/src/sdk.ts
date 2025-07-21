import { BrowserClient } from './client'
import { initClient } from '@kc-monitor/core'
import type { MonitorOptions } from '@kc-monitor/core'

export function init(options: MonitorOptions) {
  const client = new BrowserClient(options)
  initClient(client)
}
