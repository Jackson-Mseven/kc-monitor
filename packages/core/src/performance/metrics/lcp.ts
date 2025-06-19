import { PERFORMANCE_METRIC_NAME } from '../constant'
import { PerformanceMetric } from '../types'

let latestLCP = 0

export function observeLCP(callback: (data: PerformanceMetric) => void) {
  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      latestLCP = lastEntry.startTime
      callback({ name: PERFORMANCE_METRIC_NAME.LCP, value: latestLCP })
    })
    observer.observe({ type: 'largest-contentful-paint', buffered: true })
  } catch (error) {
    console.error('LCP observer error:', error)
  }
}
