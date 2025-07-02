'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useTeamMembers from '@/hooks/swr/useTeamMembers'
import Item from './item'
import { Skeleton } from '@/components/ui/skeleton'
import InviteMemberDialog from './invite-member-dialog'

const TeamMemberListCard = () => {
  const { teamMembers, isLoading, error } = useTeamMembers()

  if (isLoading) return <Skeleton className="h-10 w-full" />
  if (error) return <div>Error: {error.message}</div>

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage team members and their permissions</CardDescription>
        </div>
        <InviteMemberDialog />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers?.map((member, index) => <Item key={index} member={member} />)}
        </div>
      </CardContent>
    </Card>
  )
}

export default TeamMemberListCard
