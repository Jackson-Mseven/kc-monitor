import { PERFORMANCE_METRIC_NAME, PERFORMANCE_NAME, UNIT } from './constant'

export interface PerformanceMetric {
  name: (typeof PERFORMANCE_METRIC_NAME)[keyof typeof PERFORMANCE_METRIC_NAME]
  value: number
}

export type PerformanceName = (typeof PERFORMANCE_NAME)[keyof typeof PERFORMANCE_NAME]

export type Metric = {
  [key in PerformanceMetric['name']]?: {
    value: PerformanceMetric['value']
    unit: (typeof UNIT)[keyof typeof UNIT]
  }
}
