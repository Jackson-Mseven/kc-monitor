export interface Event {
  type: 'error' | 'performance' | 'custom'
  message?: string
  stack?: string
  metric?: string
  value?: number
  timestamp: number
  context?: Record<string, any>
}

export interface Transport {
  send(event: Event): void
}

export interface MonitorOptions {
  dsn: string
  transport?: Transport
}
