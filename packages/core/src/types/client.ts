import type { MonitorClient } from '../client'
import type { TransportInterface } from './transport'
import type { Plugin } from './plugin'

export type ClientClass<F extends MonitorClient, O extends ClientOptions> = new (options: O) => F

export interface ClientOptions {
  dsn: string
  transport: TransportInterface
  plugins?: Plugin[]
}

export interface Event {
  type: 'error' | 'performance' | 'custom'
  message?: string
  stack?: string
  metric?: string
  value?: number
  timestamp: number
  context?: Record<string, unknown>
}

export type CaptureException = (error: Error, context?: Record<string, unknown>) => void

export type CapturePerformance = (
  metric: string,
  value: number,
  context?: Record<string, unknown>
) => void
