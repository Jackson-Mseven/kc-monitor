'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import useTeamMembers from '@/hooks/swr/useTeamMembers'
import Item from './item'
import { Skeleton } from '@/components/ui/skeleton'

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
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
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
