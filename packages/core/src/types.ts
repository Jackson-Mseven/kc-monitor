import { MonitorClient } from './client'

export interface Event {
  type: 'error' | 'performance' | 'custom'
  message?: string
  stack?: string
  metric?: string
  value?: number
  timestamp: number
  context?: Record<string, unknown>
}

export interface TransportRequest {
  payload: string
}

export interface TransportResponse {
  statusCode?: number
}

export type MakeRequest = (req: TransportRequest) => Promise<TransportResponse>

export interface TransportInterface {
  send: (payload: string) => Promise<TransportResponse>
  flush: () => Promise<boolean>
}

export interface MonitorOptions {
  dsn: string
  transport: TransportInterface
}

export type ClientClass<F extends MonitorClient, O extends MonitorOptions> = new (options: O) => F
