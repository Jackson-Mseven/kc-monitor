'use client'

import type React from 'react'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { UserPlus, Mail, Shield, Code, Eye, Loader2 } from 'lucide-react'
import withTeamPermission from '@/hoc/withTeamPermission'
import { InviteTeamUserSchema, TEAM_PERMISSIONS, TEAM_ROLES } from '@kc-monitor/shared'
import useUserInfo from '@/hooks/swr/useUserInfo'
import { useTeamRoles } from '@/atoms/teamRoles'
import TeamRoleIcon from '@/components/common/team-role-icon'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { postFetcher } from '@/utils/fetcher'
import { toast } from 'sonner'

const AuthButton = withTeamPermission(Button, TEAM_PERMISSIONS.TEAM_MANAGE)

export default function InviteMemberDialog() {
  const { user } = useUserInfo()
  const teamRoles = useTeamRoles()

  const form = useForm<z.infer<typeof InviteTeamUserSchema>>({
    resolver: zodResolver(InviteTeamUserSchema),
    defaultValues: {
      team_role_id: TEAM_ROLES.MEMBER,
    },
  })

  const [open, setOpen] = useState(false)
  const [isInviting, setIsInviting] = useState(false)

  const handleSubmit = async (data: z.infer<typeof InviteTeamUserSchema>) => {
    setIsInviting(true)

    try {
      const response = await postFetcher(`/team/${user?.teams.id}/user/invite`, {
        body: data,
      })
      if (response.code === 201) {
        toast.success(response.message)
        setOpen(false)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error sending invitations:', error)
    } finally {
      setIsInviting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isInviting) {
      setOpen(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <AuthButton>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </AuthButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Team Members
          </DialogTitle>
          <DialogDescription>
            Invite new members to join &quot;{user?.teams.name}&quot;. They&apos;ll receive an email
            with instructions to join.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Email Addresses *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="team_role_id"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Role *</FormLabel>
                  <FormControl>
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => {
                        field.onChange(Number(value))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamRoles.map((role) => (
                          <SelectItem
                            key={role.id}
                            value={String(role.id)}
                            disabled={role.id === TEAM_ROLES.OWNER}
                          >
                            <div className="flex items-center gap-2">
                              <TeamRoleIcon roleId={role.id} className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{role.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {role.description}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 角色权限说明 */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role Permissions
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Eye className="h-3 w-3" />
                  <span>
                    <strong>Viewer:</strong> Can view projects, errors, and performance data
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Code className="h-3 w-3" />
                  <span>
                    <strong>Developer:</strong> Can manage projects, configure alerts, and access
                    all monitoring data
                  </span>
                </div>
                {user?.team_role_id === TEAM_ROLES.OWNER && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3" />
                    <span>
                      <strong>Admin:</strong> Can manage team members, billing, and all team
                      settings
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isInviting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isInviting}>
                {isInviting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Invitations...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Invitations
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
