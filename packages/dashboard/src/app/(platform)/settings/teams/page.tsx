'use client'

import React from 'react'
import UpdateTeamFormCard from '@/components/settings/team/update-team-form-card'
import TeamMemberListCard from '@/components/settings/team/team-member-list-card'
import useUserInfo from '@/hooks/swr/useUserInfo'
import NoTeam from '@/components/settings/team/no-team'
import { Skeleton } from '@/components/ui/skeleton'

export default function TeamsSettingsPage() {
  const { user, isLoading } = useUserInfo()

  if (isLoading) return <Skeleton className="h-full w-full" />
  if (!user?.team_id) return <NoTeam />

  return (
    <div className="grid gap-6">
      <UpdateTeamFormCard />
      <TeamMemberListCard />
    </div>
  )
}
