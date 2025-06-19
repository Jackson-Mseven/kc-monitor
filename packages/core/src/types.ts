import { TRANSACTION_TYPE } from './constant'
import { Metric } from './performance'

export interface MonitorConfig {
  dsn: string
}

export type TransactionType = (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE]

export interface Metadata {
  version?: string
}

export interface Context {
  framework?: string
  version?: string
}

export interface User {
  id: string
  name: string
  email: string
  ip_address: string
}

export interface Transaction {
  /** 事务唯一标识，由uuid生成 */
  event_id: string
  /** 时间戳 */
  timestamp: string
  /** sdk元数据 */
  metadata: Metadata
  /** 上下文 */
  context: Context
  /** 用户 */
  user: {
    id: string
    name: string
    email: string
    ip_address: string
  }
  /** 性能指标 */
  performance?: Metric
}
