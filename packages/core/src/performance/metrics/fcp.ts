import { PERFORMANCE_METRIC_NAME } from '../constant'
import { PerformanceMetric } from '../types'

export function collectFCP(): PerformanceMetric {
  const entry = performance.getEntriesByName('first-contentful-paint')[0]

  return {
    name: PERFORMANCE_METRIC_NAME.FCP,
    value: entry.startTime,
  }
}
