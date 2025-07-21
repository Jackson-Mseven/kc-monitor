import type { Event, Transport } from './types'

export class BeaconTransport implements Transport {
  constructor(private dsn: string) {}

  send(event: Event) {
    navigator.sendBeacon?.(this.dsn, JSON.stringify(event))
  }
}
