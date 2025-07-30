import type { Plugin, PluginContext, CapturePerformance } from '@kc-monitor/core'
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'

const METRICS = {
  FCP: 'FCP',
  LCP: 'LCP',
  CLS: 'CLS',
  INP: 'INP',
  TTFB: 'TTFB',
}

export default class WebVitalsPlugin implements Plugin {
  name = 'web-vitals-plugin'
  private observer: PerformanceObserver | null = null

  setup(context: PluginContext): void {
    const { client } = context

    this.setupPerformanceObservers(client.capturePerformance.bind(client))

    client.pluginManager.hooks.capturePerformance.tap(this.name, (event, metric) => {
      return {
        ...event,
        context: {
          ...event.context,
          metricCategory: this.categorizeMetric(metric),
        },
      }
    })
  }

  private setupPerformanceObservers(send: CapturePerformance) {
    this.onFCP(send)
    this.onLCP(send)
    this.onCLS(send)
    this.onTTFB(send)
    this.onINP(send)
  }

  /** 监听 FCP 指标 */
  private onFCP(send: CapturePerformance) {
    onFCP((metric) => {
      console.log('onFCP:metric---', metric)
      send(METRICS.FCP, metric.value)
    })
  }

  /** 监听 LCP 指标 */
  private onLCP(send: CapturePerformance) {
    onLCP((metric) => {
      console.log('onLCP:metric---', metric)
      send(METRICS.LCP, metric.value)
    })
  }

  /** 监听 CLS 指标 */
  private onCLS(send: CapturePerformance) {
    onCLS((metric) => {
      console.log('onCLS:metric---', metric)
      send(METRICS.CLS, metric.value)
    })
  }

  /** 监听 TTFB 指标 */
  private onTTFB(send: CapturePerformance) {
    onTTFB((metric) => {
      console.log('onTTFB:metric---', metric)
      send(METRICS.TTFB, metric.value)
    })
  }

  /** 监听 INP 指标 */
  private onINP(send: CapturePerformance) {
    onINP((metric) => {
      console.log('onINP:metric---', metric)
      send(METRICS.INP, metric.value)
    })
  }

  /**
   * 根据指标名称进行分类
   * @param metric 指标名称
   * @returns 分类结果
   */
  private categorizeMetric(metric: string): string {
    // 根据指标名称进行分类
    if (metric === METRICS.FCP || metric === METRICS.LCP || metric === METRICS.CLS) {
      return 'rendering'
    }
    if (metric.startsWith('ttfb') || metric.startsWith('dns') || metric.startsWith('tcp')) {
      return 'network'
    }
    return 'other'
  }

  // 清理方法，用于断开性能观察器
  cleanup(): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }
}
