import type { Event } from '@kc-monitor/core'

export function addGlobalErrorListener(send: (event: Event) => void) {
  window.addEventListener('error', (e) => {
    send({
      type: 'error',
      message: e.message,
      stack: e.error?.stack,
      timestamp: Date.now(),
    })
  })

  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason instanceof Error ? e.reason : new Error(String(e.reason))
    send({
      type: 'error',
      message: reason.message,
      stack: reason.stack,
      timestamp: Date.now(),
    })
  })
}
