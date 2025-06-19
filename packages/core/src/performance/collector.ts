import { monitor } from '../monitor'
import { collectTTFB } from './metrics/ttfb'
import { collectFCP } from './metrics/fcp'
import { collectPageLoad } from './metrics/page-load'
import { observeLCP } from './metrics/lcp'
import { observeCLS } from './metrics/cls'
import { UNIT } from './constant'
import { Metric } from './types'

let metrics = {} as Metric

export function collectPerformance() {
  observeLCP(({ name, value }) => {
    metrics[name] = { value, unit: UNIT.MILLISECOND }
  })

  observeCLS(({ name, value }) => {
    metrics[name] = { value, unit: UNIT.MILLISECOND }
  })

  window.addEventListener('load', () => {
    const ttfb = collectTTFB()
    const fcp = collectFCP()
    const pageLoad = collectPageLoad()

    setTimeout(() => {
      metrics[ttfb.name] = { value: ttfb?.value, unit: UNIT.MILLISECOND }
      metrics[fcp.name] = { value: fcp.value, unit: UNIT.MILLISECOND }
      metrics[pageLoad.name] = { value: pageLoad.value, unit: UNIT.MILLISECOND }
      monitor.report('performance', metrics)
      metrics = {}
    })
  })
}
