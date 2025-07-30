import { SyncHook, SyncBailHook, SyncWaterfallHook, AsyncSeriesHook } from 'tapable'
import type { Plugin, PluginContext } from './types'
import type { Event, ClientOptions } from './types/client'
import type { MonitorClient } from './client'

export default class PluginManager {
  private plugins: Plugin[] = []
  private client: MonitorClient

  // 定义各种钩子
  public hooks = {
    // 初始化钩子
    /** 初始化 */
    init: new SyncHook<[ClientOptions]>(['options']),

    // 错误处理钩子
    /** 捕获异常前 */
    beforeCaptureException: new SyncHook<[Error, Record<string, unknown> | undefined]>([
      'error',
      'context',
    ]),
    /** 捕获异常，封装数据后 */
    captureException: new SyncWaterfallHook<[Event, Error, Record<string, unknown> | undefined]>([
      'event',
      'error',
      'context',
    ]),
    /** 捕获异常后 */
    afterCaptureException: new SyncHook<[Event]>(['event']),

    // 性能指标钩子
    /** 捕获性能指标前 */
    beforeCapturePerformance: new SyncHook<[string, number, Record<string, unknown> | undefined]>([
      'metric',
      'value',
      'context',
    ]),
    /** 捕获性能指标，封装数据后 */
    capturePerformance: new SyncWaterfallHook<
      [Event, string, number, Record<string, unknown> | undefined]
    >(['event', 'metric', 'value', 'context']),
    /** 捕获性能指标后 */
    afterCapturePerformance: new SyncHook<[Event]>(['event']),

    // 发送事件钩子
    /** 发送事件前 */
    beforeSendEvent: new SyncBailHook<[Event], boolean | undefined>(['event']),
    /** 转换事件数据 */
    transformEvent: new SyncWaterfallHook<[Event], Event>(['event']),
    /** 发送事件后 */
    afterSendEvent: new SyncHook<[Event]>(['event']),

    // 异步刷新钩子
    /** 异步刷新 */
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
