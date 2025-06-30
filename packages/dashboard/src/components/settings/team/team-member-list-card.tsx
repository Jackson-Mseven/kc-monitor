'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import useTeamMembers from '@/hooks/swr/useTeamMembers'
import { TeamRole, useTeamRoles } from '@/atoms/teamRoles'

const teamMembers = [
  { name: 'John Doe', email: 'john@example.com', role: 'Owner', avatar: 'JD', status: 'active' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', avatar: 'JS', status: 'active' },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'Developer',
    avatar: 'MJ',
    status: 'active',
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'Developer',
    avatar: 'SW',
    status: 'pending',
  },
]

const TeamMemberListCard = () => {
  const { teamMembers, isLoading, error } = useTeamMembers()
  console.log('teamMembers---', teamMembers)
  const teamRoles = useTeamRoles()
  console.log('teamRoles---', teamRoles)

  if (isLoading) return <div>Loading...</div>
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
          {teamMembers?.map((member, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar>
                  {/* <AvatarImage src={member.avatar} alt={member.name} /> */}
                  <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                  {member.status}
                </Badge> */}
                <Badge variant="default">Active</Badge>
                <Select defaultValue={String(member.team_role_id)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teamRoles?.map((role: TeamRole) => (
                      <SelectItem key={role.id} value={String(role.id)}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Resend Invitation</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TeamMemberListCard
