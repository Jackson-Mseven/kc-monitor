'use client'

import React, { useMemo } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import PlatformSidebar from '@/components/platform/sidebar'
import ThemeProvider from '@/components/platform/theme-provider'
import useAuthGuard from '@/hooks/useAuthGuard'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  useAuthGuard()
  const pathname = usePathname()
  const breadcrumb = useMemo(() => {
    const breadcrumb: { label: string; href: string }[] = []
    const pathSegments = pathname.split('/')
    pathSegments.forEach((segment, index) => {
      if (segment) {
        breadcrumb.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: `${pathSegments.slice(0, index + 1).join('/')}`,
        })
      }
    })
    return breadcrumb
  }, [pathname])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        <PlatformSidebar />
        <main className="flex-1">
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumb.map((item, index) => (
                      <React.Fragment key={index}>
                        <BreadcrumbItem>
                          {index === breadcrumb.length - 1 ? (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {index < breadcrumb.length - 1 && <BreadcrumbSeparator />}
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
          </SidebarInset>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  )
}
