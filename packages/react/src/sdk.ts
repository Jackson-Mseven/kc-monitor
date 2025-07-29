import { init as initBrowser } from '@kc-monitor/browser'
import { BrowserMonitorOptions } from 'packages/browser/src/types'

export function init(options: BrowserMonitorOptions) {
  initBrowser(options)
}
