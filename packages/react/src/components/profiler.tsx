import React, { Profiler as ReactProfiler } from 'react'
import { capturePerformance } from '@kc-monitor/core'

export const Profiler = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const onRender: React.ProfilerOnRenderCallback = (id, phase, actualDuration) => {
    capturePerformance(`react-${id}-${phase}`, actualDuration)
  }

  return (
    <ReactProfiler id={id} onRender={onRender}>
      {children}
    </ReactProfiler>
  )
}
