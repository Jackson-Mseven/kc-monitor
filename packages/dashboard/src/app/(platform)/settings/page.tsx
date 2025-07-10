'use client'

import { useEffect } from 'react'

const SettingsPage = () => {
  useEffect(() => {
    window.location.replace('/settings/user')
  }, [])

  return null
}

export default SettingsPage
