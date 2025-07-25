import type { Event, MonitorOptions, TransportInterface } from './types'

export abstract class MonitorClient<O extends MonitorOptions = MonitorOptions> {
  private _transport: TransportInterface

  constructor(options: O) {
    this._transport = options.transport
  }

  sendEvent(event: Event) {
    this._transport.send(JSON.stringify(event))
  }

  captureException(error: Error, context?: Record<string, unknown>) {
    this.sendEvent({
      type: 'error',
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
    })
  }
}
