import { MonitorClient } from '../client'

export interface PluginContext {
  client: MonitorClient
}

export interface Plugin {
  name: string
  setup(context: PluginContext): void
}
