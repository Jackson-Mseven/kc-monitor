import { init as initBrowser } from '@kc-monitor/browser'
import { BrowserClientOptions } from 'packages/browser/src/types'

/**
 * 初始化 React 端 SDK
 * @param options 配置项
 */
export function init(options: BrowserClientOptions) {
  initBrowser(options)
}
