import { ClientOptions } from '@kc-monitor/core'

export type BrowserClientOptions = Omit<ClientOptions, 'transport'> &
  Partial<Pick<ClientOptions, 'transport'>>
