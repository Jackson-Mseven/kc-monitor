import { PERFORMANCE_METRIC_NAME } from '../constant'
import { PerformanceMetric } from '../types'

let clsValue = 0

interface LayoutShift extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}

export function observeCLS(callback: (data: PerformanceMetric) => void) {
  try {
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as LayoutShift[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      callback({ name: PERFORMANCE_METRIC_NAME.CLS, value: clsValue })
    })

    observer.observe({ type: 'layout-shift', buffered: true })
  } catch (error) {
    console.error('CLS observer error:', error)
  }
}
