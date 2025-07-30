import type { MonitorClient } from './client'
import { getCurrentClient, initClient } from './hub'
import type { ClientClass, MonitorOptions } from './types/client'

export function init<C extends MonitorClient, O extends MonitorOptions>(
  clientClass: ClientClass<C, O>,
  options: O
) {
  const client = new clientClass(options)

  if (options.plugins && options.plugins.length > 0) {
    client.pluginManager.registerAll(options.plugins)
  }

  initClient(client)
  return client
}

export function captureException(error: Error, context?: Record<string, unknown>) {
  getCurrentClient()?.captureException(error, context)
}
