import React, { Profiler as ReactProfiler } from 'react'
import { capturePerformance } from '@kc-monitor/core'

/**
 * 性能分析组件，用于捕获子组件的渲染性能
 */
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
