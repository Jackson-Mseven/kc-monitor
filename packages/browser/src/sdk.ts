import { BrowserClient } from './client'
import { init as initCore } from '@kc-monitor/core'
import type { BrowserClientOptions } from './types'
import { createBrowserTransport } from './transports/browser'
import GlobalHandlersPlugin from './plugins/global-handlers'
import WebVitalsPlugin from './plugins/web-vitals'

/** 初始化浏览器端 SDK */
export function init(options: BrowserClientOptions) {
  const clientOptions = {
    ...options,
    transport: options.transport || createBrowserTransport(),
    plugins: [new GlobalHandlersPlugin(), new WebVitalsPlugin(), ...(options.plugins || [])],
  }
  initCore(BrowserClient, clientOptions)
}
