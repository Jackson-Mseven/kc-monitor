import { BrowserClient } from './client'
import { init as initCore } from '@kc-monitor/core'
import type { BrowserMonitorOptions } from './types'
import { createBrowserTransport } from './transports/browser'

export function init(options: BrowserMonitorOptions) {
  const clientOptions = {
    ...options,
    transport: options.transport || createBrowserTransport(),
  }
  initCore(BrowserClient, clientOptions)
}
