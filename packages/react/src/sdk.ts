import { init as initCore, monitor } from '@kc-monitor/core'
import { MonitorConfig } from 'packages/core/src/types'
import { version } from 'react'

export async function init(config: MonitorConfig): Promise<void> {
  monitor.context = { framework: 'react', version }
  initCore(config)
}
