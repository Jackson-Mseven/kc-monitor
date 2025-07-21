import { MonitorClient } from '@kc-monitor/core'
import type { MonitorOptions, Event } from '@kc-monitor/core'
import { addGlobalErrorListener } from './handlers'
import { addPerformanceObservers } from './performance'

export class BrowserClient extends MonitorClient {
  constructor(options: MonitorOptions) {
    super(options)
    this._setup()
  }

  private _setup() {
    addGlobalErrorListener((event: Event) => this.sendEvent(event))
    addPerformanceObservers((event: Event) => this.sendEvent(event))
  }
}
