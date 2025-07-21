import type { MonitorOptions } from '@kc-monitor/core'
import { init as initBrowser } from '@kc-monitor/browser'

export function init(options: MonitorOptions) {
  initBrowser(options)
}
