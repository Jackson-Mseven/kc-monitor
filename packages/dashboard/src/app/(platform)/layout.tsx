'use client'

import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import PlatformSidebar from '@/components/platform/sidebar'
import ThemeProvider from '@/components/platform/theme-provider'
import useAuth from '@/hooks/useAuth'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  useAuth()

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        <PlatformSidebar />
        <main className="flex-1">{children}</main>
      </SidebarProvider>
    </ThemeProvider>
  )
}
