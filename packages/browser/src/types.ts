import { MonitorOptions } from '@kc-monitor/core'

export type BrowserMonitorOptions = Omit<MonitorOptions, 'transport'> &
  Partial<Pick<MonitorOptions, 'transport'>>
