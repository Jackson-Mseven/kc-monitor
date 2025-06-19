import { PERFORMANCE_METRIC_NAME } from '../constant'
import { PerformanceMetric } from '../types'

export function collectTTFB(): PerformanceMetric {
  const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]

  return {
    name: PERFORMANCE_METRIC_NAME.TTFB,
    value: nav.responseStart - nav.requestStart,
  }
}
