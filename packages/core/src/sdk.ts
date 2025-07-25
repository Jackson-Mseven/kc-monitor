import { MonitorClient } from './client'
import { getCurrentClient, initClient } from './hub'
import type { ClientClass, MonitorOptions } from './types'

export function init<C extends MonitorClient, O extends MonitorOptions>(
  clientClass: ClientClass<C, O>,
  options: O
) {
  const client = new clientClass(options)
  initClient(client)
  return client
}

export function captureException(error: Error, context?: Record<string, unknown>) {
  getCurrentClient()?.captureException(error, context)
}
