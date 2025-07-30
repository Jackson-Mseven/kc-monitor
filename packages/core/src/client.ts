import type { TransportInterface } from './types/transport'
import type { Event, MonitorOptions } from './types/client'
import PluginManager from './plugin-manager'

export abstract class MonitorClient<O extends MonitorOptions = MonitorOptions> {
  private _transport: TransportInterface
  private _pluginManager: PluginManager
  protected options: O

  constructor(options: O) {
    this.options = options
    this._transport = options.transport
    this._pluginManager = new PluginManager(this)
    this._pluginManager.hooks.init.call(options)
  }

  /** 插件管理器实例 */
  get pluginManager(): PluginManager {
    return this._pluginManager
  }

  /**
   * 上报事件
   * @param event 事件实例
   * @returns 是否成功上报
   */
  sendEvent(event: Event): boolean {
    const shouldCancel = this._pluginManager.hooks.beforeSendEvent.call(event)
    if (shouldCancel === true) {
      return false
    }
    const transformedEvent = this._pluginManager.hooks.transformEvent.call(event)
    this._transport.send(JSON.stringify(transformedEvent))
    this._pluginManager.hooks.afterSendEvent.call(transformedEvent)
    return true
  }

  /**
   * 上报异常
   * @param error 异常实例
   * @param context 异常上下文
   */
  captureException(error: Error, context?: Record<string, unknown>) {
    this._pluginManager.hooks.beforeCaptureException.call(error, context)
    let event: Event = {
      type: 'error',
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
    }
    event = this._pluginManager.hooks.captureException.call(event, error, context)
    const isSuccess = this.sendEvent(event)
    this._pluginManager.hooks.afterCaptureException.call(event)
    return isSuccess
  }

  /**
   * 上报性能指标
   * @param metric 指标名称
   * @param value 指标值
   * @param context 指标上下文
   */
  capturePerformance(metric: string, value: number, context?: Record<string, unknown>) {
    this._pluginManager.hooks.beforeCapturePerformance.call(metric, value, context)
    let event: Event = {
      type: 'performance',
      metric,
      value,
      context,
      timestamp: Date.now(),
    }
    event = this._pluginManager.hooks.capturePerformance.call(event, metric, value, context)
    const isSuccess = this.sendEvent(event)
    this._pluginManager.hooks.afterCapturePerformance.call(event)
    return isSuccess
  }

  /** 刷新方法 */
  async flush(): Promise<boolean> {
    // 触发刷新钩子
    await this._pluginManager.hooks.flush.promise()
    return this._transport.flush()
  }
}
