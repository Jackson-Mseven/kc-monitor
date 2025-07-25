import { BrowserClient } from './client'
import { init as initCore } from '@kc-monitor/core'
import type { MonitorOptions } from '@kc-monitor/core'
import { createBrowserTransport } from './transports/browser'

export function init(options: MonitorOptions) {
  const clientOptions = {
    ...options,
    transport: createBrowserTransport(),
  }
  initCore(BrowserClient, clientOptions)
}
