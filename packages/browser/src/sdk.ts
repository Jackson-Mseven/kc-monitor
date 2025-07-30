import { BrowserClient } from './client'
import { init as initCore } from '@kc-monitor/core'
import type { BrowserMonitorOptions } from './types'
import { createBrowserTransport } from './transports/browser'
import GlobalHandlersPlugin from './plugins/global-handlers'
import WebVitalsPlugin from './plugins/web-vitals'

export function init(options: BrowserMonitorOptions) {
  const clientOptions = {
    ...options,
    transport: options.transport || createBrowserTransport(),
    plugins: [new GlobalHandlersPlugin(), new WebVitalsPlugin(), ...(options.plugins || [])],
  }
  initCore(BrowserClient, clientOptions)
}
