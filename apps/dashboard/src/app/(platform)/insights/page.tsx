'use client'

import { useEffect } from 'react'

const InsightsPage = () => {
  useEffect(() => {
    window.location.replace('/insights/projects')
  }, [])

  return null
}

export default InsightsPage
