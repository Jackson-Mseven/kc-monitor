import { captureException } from '@kc-monitor/core'
import React, { PropsWithChildren } from 'react'

interface ErrorBoundaryProps {
  fallback?: React.ReactNode
  onError?: (error: Error, componentStack: string) => void
}

interface ErrorBoundaryState {
  error: Error | null
  componentStack: string
}

/**
 * 错误边界组件，用于捕获子组件的异常
 */
export class ErrorBoundary extends React.Component<
  PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<ErrorBoundaryProps>) {
    super(props)
    this.state = { error: null, componentStack: '' }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ componentStack: errorInfo.componentStack ?? '' })

    captureException(error, {
      componentStack: this.state.componentStack,
    })

    // 用户自定义回调
    if (this.props.onError) {
      this.props.onError(error, this.state.componentStack)
    }
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return <h1>出错了</h1>
    }
    return this.props.children
  }
}
