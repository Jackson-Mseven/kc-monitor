'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useTeamMembers from '@/hooks/swr/useTeamMembers'
import Item from './item'
import { Skeleton } from '@/components/ui/skeleton'
import InviteMemberDialog from './invite-member-dialog'
import withTeamPermission from '@/hoc/withTeamPermission'
import { Button } from '@/components/ui/button'
import { TEAM_PERMISSIONS } from '@kc-monitor/shared'
import { List } from 'lucide-react'
import CustomLink from '@/components/base/CustomLink'

const AuthButton = withTeamPermission(Button, TEAM_PERMISSIONS.TEAM_MANAGE)

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
        <div className="flex items-center gap-2">
          <AuthButton>
            <CustomLink href="/apply" className="flex items-center">
              <List className="mr-2 h-4 w-4" />
              View Applications
            </CustomLink>
          </AuthButton>
          <InviteMemberDialog />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers?.map((member, index) => (
            <Item key={index} member={member} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TeamMemberListCard
