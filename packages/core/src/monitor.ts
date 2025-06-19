import type { Context, Metadata, MonitorConfig, Transaction, TransactionType, User } from './types'
import reportBeacon from './utils/reportBeacon'
import { v4 as uuidv4 } from 'uuid'
import { version } from '../package.json'

class Monitor {
  #config: MonitorConfig = { dsn: '' }
  #metadata: Metadata = { version }
  #context: Context = {}
  #user: User = {
    id: '1',
    name: 'kincy',
    email: 'bill714@foxmail.com',
    ip_address: 'hangzhou,china',
  }

  set config(config: MonitorConfig) {
    this.#config = config
  }

  get config() {
    return this.#config
  }

  set metadata(metadata: Metadata) {
    this.#metadata = { ...this.#metadata, ...metadata }
  }

  get metadata() {
    return this.#metadata
  }

  set context(context: Context) {
    this.#context = { ...this.#context, ...context }
  }

  get context() {
    return this.#context
  }

  set user(user: User) {
    this.#user = { ...this.#user, ...user }
  }

  get user() {
    return this.#user
  }

  sendTransaction(transaction) {
    if (!this.#config.dsn) return
    reportBeacon<Transaction>(this.#config.dsn, {
      event_id: uuidv4().replace(/-/g, ''),
      timestamp: new Date().toLocaleString(),
      metadata: this.#metadata,
      context: this.#context,
      user: this.#user,
      ...transaction,
    })
  }

  report<T extends TransactionType>(type: T, data: Transaction[T]) {
    if (!this.#config.dsn) return
    this.sendTransaction({
      [type]: data,
    })
  }
}

export const monitor = new Monitor()
