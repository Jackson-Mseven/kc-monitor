import React, { Profiler as ReactProfiler } from 'react'
import { getCurrentClient } from '@kc-monitor/core'
import type { Event } from '@kc-monitor/core'

export const Profiler = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const onRender: React.ProfilerOnRenderCallback = (id, phase, actualDuration) => {
    const event: Event = {
      type: 'performance',
      metric: `react-${id}-${phase}`,
      value: actualDuration,
      timestamp: Date.now(),
    }
    getCurrentClient()?.sendEvent(event)
  }

  return (
    <ReactProfiler id={id} onRender={onRender}>
      {children}
    </ReactProfiler>
  )
}
