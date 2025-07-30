import type { Plugin, PluginContext, CaptureException } from '@kc-monitor/core/src/types'

export default class GlobalHandlersPlugin implements Plugin {
  name = 'global-handlers-plugin'
  private removeListeners: (() => void)[] = []
  private originalOnError: OnErrorEventHandler | null = null

  setup(context: PluginContext): void {
    const { client } = context

    // 添加全局错误监听
    this.setupGlobalErrorListeners(client.captureException.bind(client))

    client.pluginManager.hooks.captureException.tap(this.name, (event, error) => {
      return {
        ...event,
        context: {
          ...event.context,
          errorType: error.name,
          userAgent: navigator.userAgent,
          url: window.location.href,
        },
      }
    })

    client.pluginManager.hooks.transformEvent.tap(this.name, (event) => {
      if (event.type === 'error') {
        return {
          ...event,
          context: {
            ...event.context,
            url: window.location.href,
          },
        }
      }
      return event
    })
  }

  private setupGlobalErrorListeners(send: CaptureException) {
    this.captureUncaughtExceptionByWindow(send)
    this.captureUncaughtExceptionByEventListener(send)
    this.capturePromiseExceptionByEventListener(send)
  }

  /** 捕获未捕获的异常 */
  private captureUncaughtExceptionByWindow = (send: CaptureException) => {
    this.originalOnError = window.onerror
    window.onerror = (message, source, lineno, colno, error) => {
      // 调用原始的 onerror 处理程序（如果存在）
      if (this.originalOnError) {
        this.originalOnError.call(window, message, source, lineno, colno, error)
      }

      // 捕获错误
      if (error) {
        send(error)
      } else {
        // 如果没有提供 error 对象，创建一个
        const errorObj = new Error(typeof message === 'string' ? message : String(message))
        errorObj.stack = `at ${source || 'unknown'}:${lineno || 0}:${colno || 0}`
        send(errorObj, {
          source,
          lineno,
          colno,
        })
      }

      // 返回 true 表示错误已处理，阻止默认处理
      return true
    }
    this.removeListeners.push(() => {
      window.onerror = this.originalOnError
    })
  }

  /** 捕获静态资源加载错误 */
  private captureUncaughtExceptionByEventListener = (send: CaptureException) => {
    const errorHandler = (event: ErrorEvent) => {
      if (event.target !== window) {
        send(event.error)
      }
    }
    window.addEventListener('error', errorHandler, true)
    this.removeListeners.push(() => window.removeEventListener('error', errorHandler))
  }

  /** 捕获未处理的 Promise Rejected */
  private capturePromiseExceptionByEventListener = (send: CaptureException) => {
    const rejectionHandler = (e: PromiseRejectionEvent) => {
      const reason = e.reason instanceof Error ? e.reason : new Error(String(e.reason))
      send(reason)
    }
    window.addEventListener('unhandledrejection', rejectionHandler)
    this.removeListeners.push(() =>
      window.removeEventListener('unhandledrejection', rejectionHandler)
    )
  }

  // 清理方法，用于移除事件监听器
  cleanup(): void {
    this.removeListeners.forEach((remove) => remove())
    this.removeListeners = []
  }
}
