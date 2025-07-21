import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { init, ErrorBoundary, Profiler } from '@kc-monitor/react'

init({
  dsn: 'https://xxx/monitor',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Profiler id="App">
        <App />
      </Profiler>
    </ErrorBoundary>
  </StrictMode>
)
