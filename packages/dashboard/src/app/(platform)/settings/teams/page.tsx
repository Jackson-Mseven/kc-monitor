'use client'

import React from 'react'
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
import UpdateTeamFormCard from '@/components/settings/team/update-team-form-card'
import TeamMemberListCard from '@/components/settings/team/team-member-list-card'
import useUserInfo from '@/hooks/swr/useUserInfo'
import NoTeam from '@/components/settings/team/no-team'
import { Skeleton } from '@/components/ui/skeleton'

export default function TeamsSettingsPage() {
  const { user, isLoading } = useUserInfo()

  if (isLoading) {
    return <Skeleton className="h-full w-full" />
  }

  if (!user?.team_id) {
    return <NoTeam />
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Settings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Team Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid gap-6">
          <UpdateTeamFormCard />
          <TeamMemberListCard />
        </div>
      </div>
    </SidebarInset>
  )
}
