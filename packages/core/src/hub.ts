import type { MonitorClient } from './client'

let globalClient: MonitorClient | null = null

/** 初始化全局客户端 */
export function initClient(client: MonitorClient) {
  globalClient = client
}

/** 获取当前的全局客户端 */
export function getCurrentClient(): MonitorClient | null {
  return globalClient
}
