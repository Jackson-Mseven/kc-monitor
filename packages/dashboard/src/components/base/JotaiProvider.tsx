'use client'

import React, { PropsWithChildren } from 'react'
import { Provider } from 'jotai'

export default function JotaiProvider({ children }: PropsWithChildren) {
  return <Provider>{children}</Provider>
}
