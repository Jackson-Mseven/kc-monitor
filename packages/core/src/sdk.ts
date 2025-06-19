import { monitor } from './monitor'
import { collectPerformance } from './performance'
import { MonitorConfig } from './types'

export async function init(config: MonitorConfig) {
  monitor.config = config

  collectPerformance()
}
