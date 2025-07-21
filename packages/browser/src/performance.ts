import type { Event } from '@kc-monitor/core'

export function addPerformanceObservers(send: (event: Event) => void) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'paint') {
        send({
          type: 'performance',
          metric: entry.name, // 'first-paint' | 'first-contentful-paint'
          value: entry.startTime,
          timestamp: Date.now(),
        })
      } else if (entry.entryType === 'largest-contentful-paint') {
        send({
          type: 'performance',
          metric: 'LCP',
          value: entry.startTime,
          timestamp: Date.now(),
        })
      } else if (entry.entryType === 'layout-shift' /* && !entry.hadRecentInput */) {
        send({
          type: 'performance',
          metric: 'CLS',
          value: 999,
          // value: entry.value,
          timestamp: Date.now(),
        })
      }
    }
  })

  observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] })
}
