import { PERFORMANCE_METRIC_NAME } from '../constant'
import { PerformanceMetric } from '../types'

export function collectPageLoad(): PerformanceMetric {
  const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]

  return {
    name: PERFORMANCE_METRIC_NAME.PAGE_LOAD,
    value: nav.loadEventEnd - nav.startTime,
  }
}
