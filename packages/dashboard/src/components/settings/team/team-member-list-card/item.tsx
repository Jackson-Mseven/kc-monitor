'use client'

import React from 'react'
import { TEAM_PERMISSIONS, TEAM_ROLES, User } from '@kc-monitor/shared'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useTeamRoles } from '@/atoms/teamRoles'
import withTeamPermission from '@/hoc/withTeamPermission'
import useUserInfo from '@/hooks/swr/useUserInfo'

const AuthSelect = withTeamPermission(Select, TEAM_PERMISSIONS['TEAM_MANAGE'])
const AuthButton = withTeamPermission(Button, TEAM_PERMISSIONS['TEAM_DELETE'])

interface ItemProps {
  member: Omit<User, 'password'>
}

const Item: React.FC<ItemProps> = ({ member }) => {
  const teamRoles = useTeamRoles()
  const { user } = useUserInfo()

  const userIsOwner = user?.team_role_id === TEAM_ROLES.OWNER

  const handleRemove = () => {
    console.log('remove', member)
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
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
        <AuthSelect defaultValue={String(member.team_role_id)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {teamRoles?.map((role) => (
              <SelectItem key={role.id} value={String(role.id)}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </AuthSelect>
        {user?.id === member.id ? (
          <Button variant="error" disabled={userIsOwner} className="w-24">
            Leave
          </Button>
        ) : (
          <AuthButton className="w-24" onClick={handleRemove}>
            Remove
          </AuthButton>
        )}
      </div>
    </div>
  )
}

export default Item
