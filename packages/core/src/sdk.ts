import { MonitorClient } from './client'
import { getCurrentClient, initClient } from './hub'
import { MonitorOptions } from './types'

export function init(options: MonitorOptions) {
  const client = new MonitorClient(options)
  initClient(client)
}

export function captureException(error: Error, context?: Record<string, any>) {
  getCurrentClient()?.captureException(error, context)
}
