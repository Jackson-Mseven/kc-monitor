'use client'

import type React from 'react'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { UserMinus, Loader2, Mail } from 'lucide-react'
import { TEAM_PERMISSIONS, TEAM_ROLES } from '@kc-monitor/shared'
import withTeamPermission from '@/hoc/withTeamPermission'
import dayjs from 'dayjs'
import { useTeamRoles } from '@/atoms/teamRoles'
import { deleteFetcher } from '@/utils/fetcher'
import { User as UserType } from '@kc-monitor/shared'
import { toast } from 'sonner'
import TeamRoleIcon from '@/components/common/team-role-icon'

const AuthButton = withTeamPermission(Button, TEAM_PERMISSIONS['TEAM_DELETE'])

interface RemoveMemberAlertDialogProps {
  member: Omit<UserType, 'password'>
  currentUserRole: number
  teamName: string
}

export default function RemoveMemberAlertDialog({
  member,
  currentUserRole,
  teamName,
}: RemoveMemberAlertDialogProps) {
  const teamRoles = useTeamRoles()

  const [isRemoving, setIsRemoving] = useState(false)
  const [open, setOpen] = useState(false)

  const canRemove = () => {
    return currentUserRole === TEAM_ROLES.OWNER
  }

  const handleConfirm = async () => {
    if (!canRemove()) return

    setIsRemoving(true)
    try {
      const response = await deleteFetcher(`/team/${member?.team_id}/user/${member?.id}`)
      if (response.code === 200) {
        toast.success(response.message)
        setOpen(false)
        window.location.reload()
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error removing member:', error)
    } finally {
      setIsRemoving(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isRemoving) {
      setOpen(newOpen)
    }
  }

  const getRoleColor = (role: number) => {
    switch (role) {
      case TEAM_ROLES.OWNER:
        return 'destructive'
      case TEAM_ROLES.MANAGER:
        return 'default'
      default:
        return 'secondary'
    }
  }

  if (!canRemove()) {
    return (
      <Button variant="ghost" size="sm" disabled className="gap-2 opacity-50">
        <UserMinus className="h-4 w-4" />
        Remove
      </Button>
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <AuthButton className="w-24">Remove</AuthButton>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full">
              <UserMinus className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-semibold text-red-900 dark:text-red-100">
                Remove Team Member
              </AlertDialogTitle>
              <p className="text-sm text-muted-foreground">
                This action will remove the member from &quot;{teamName}&quot;
              </p>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* 成员信息卡片 */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                {/* <AvatarImage src={member.avatar_url} alt={member.name} /> */}
                <AvatarFallback>{member?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{member?.name}</h3>
                  <Badge variant={getRoleColor(member?.team_role_id ?? 0)} className="gap-1">
                    <TeamRoleIcon roleId={member?.team_role_id} className="h-3 w-3" />
                    {teamRoles?.find((role) => role.id === member?.team_role_id)?.name}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {member?.email}
                </div>
                {member?.created_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Joined {dayjs(member.created_at).format('YYYY-MM-DD')}
                  </p>
                )}
              </div>
            </div>
          </div>

          <AlertDialogDescription className="text-sm text-muted-foreground space-y-3">
            <p>Removing {member?.name} from the team will:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Immediately revoke their access to all team projects</li>
              <li>Remove them from all team notifications and discussions</li>
              <li>Cancel any pending invitations or access requests</li>
              <li>Preserve their contribution history in projects</li>
            </ul>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> {member?.name} will be notified about their removal from the
                team. They can be re-invited later if needed.
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              This action is immediate but reversible - you can invite them back to the team at any
              time.
            </p>
          </AlertDialogDescription>
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel disabled={isRemoving} className="bg-transparent">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isRemoving}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isRemoving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing Member...
              </>
            ) : (
              <>
                <UserMinus className="mr-2 h-4 w-4" />
                Remove {member?.name}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
