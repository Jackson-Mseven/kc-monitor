import { SyncHook, SyncBailHook, SyncWaterfallHook, AsyncSeriesHook } from 'tapable'
import type { Plugin, PluginContext } from './types'
import type { Event, MonitorOptions } from './types/client'
import type { MonitorClient } from './client'

export default class PluginManager {
  private plugins: Plugin[] = []
  private client: MonitorClient

  // 定义各种钩子
  public hooks = {
    // 初始化钩子
    init: new SyncHook<[MonitorOptions]>(['options']),

    // 错误处理钩子
    beforeCaptureException: new SyncHook<[Error, Record<string, unknown> | undefined]>([
      'error',
      'context',
    ]),
    captureException: new SyncWaterfallHook<[Event, Error, Record<string, unknown> | undefined]>([
      'event',
      'error',
      'context',
    ]),
    afterCaptureException: new SyncHook<[Event]>(['event']),

    // 性能指标钩子
    beforeCapturePerformance: new SyncHook<[string, number, Record<string, unknown> | undefined]>([
      'metric',
      'value',
      'context',
    ]),
    capturePerformance: new SyncWaterfallHook<
      [Event, string, number, Record<string, unknown> | undefined]
    >(['event', 'metric', 'value', 'context']),
    afterCapturePerformance: new SyncHook<[Event]>(['event']),

    // 发送事件钩子
    beforeSendEvent: new SyncBailHook<[Event], boolean | undefined>(['event']),
    transformEvent: new SyncWaterfallHook<[Event], Event>(['event']),
    afterSendEvent: new SyncHook<[Event]>(['event']),

    // 异步刷新钩子
    flush: new AsyncSeriesHook<[]>([]),
  }

  constructor(client: MonitorClient) {
    this.client = client
  }

  /** 注册插件 */
  public register(plugin: Plugin): void {
    if (this.plugins.some((p) => p.name === plugin.name)) {
      console.warn(`Plugin with name ${plugin.name} is already registered.`)
      return
    }

    this.plugins.push(plugin)

    // 设置插件上下文并调用插件的 setup 方法
    const context: PluginContext = {
      client: this.client,
    }

    plugin.setup(context)
  }

  /** 注册多个插件 */
  public registerAll(plugins: Plugin[]): void {
    plugins.forEach((plugin) => this.register(plugin))
  }

  /** 获取所有已注册的插件 */
  public getAllPlugins(): Plugin[] {
    return [...this.plugins]
  }

  /** 根据名称获取插件 */
  public getPlugin(name: string): Plugin | undefined {
    return this.plugins.find((plugin) => plugin.name === name)
  }
}
