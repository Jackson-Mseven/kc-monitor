import type { Event, MonitorOptions, Transport } from './types'
import { BeaconTransport } from './transport'

export class MonitorClient {
  private transport: Transport

  constructor(private options: MonitorOptions) {
    this.transport = options.transport || new BeaconTransport(options.dsn)
  }

  sendEvent(event: Event) {
    this.transport.send(event)
  }

  captureException(error: Error, context?: Record<string, any>) {
    console.log('error---', error)
    console.log('context---', context)
    this.sendEvent({
      type: 'error',
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
    })
  }
}
