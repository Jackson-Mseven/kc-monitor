import type { MonitorClient } from './client'

let globalClient: MonitorClient | null = null

export function initClient(client: MonitorClient) {
  globalClient = client
}

export function getCurrentClient(): MonitorClient | null {
  return globalClient
}
