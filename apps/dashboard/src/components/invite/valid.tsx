'use client'

import { InviteInfo } from '@kc-monitor/shared'
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  Mail,
  Users,
  XCircle,
} from 'lucide-react'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { Alert, AlertDescription } from '../ui/alert'
import TeamRoleIcon from '../common/team-role-icon'
import Processed, { ProcessedProps } from './processed'
import dayjs from 'dayjs'
import { postFetcher } from '@/utils/fetcher'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

const Valid: React.FC<{ inviteInfo: InviteInfo }> = ({ inviteInfo }) => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [isProcessing, setIsProcessing] = useState(false)
  const [actionResult, setActionResult] = useState<ProcessedProps['actionResult'] | null>(null)

  const handleAcceptInvite = async () => {
    if (!inviteInfo) return
    setIsProcessing(true)
    try {
      const response = await postFetcher(`/team/null/invite/accept/${token}`, {
        headers: {},
      })
      if (response.code !== 200) {
        toast.error(response.message)
        return
      } else {
        toast.success(response.message)
        setActionResult('accepted')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 3000)
      }
    } catch (error) {
      console.error('Error accepting invite:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeclineInvite = async () => {
    if (!inviteInfo) return
    setIsProcessing(true)
    try {
      const response = await postFetcher(`/team/null/invite/reject/${token}`, {
        headers: {},
      })
      if (response.code !== 200) {
        toast.error(response.message)
        return
      } else {
        toast.success('邀请已拒绝')
        setActionResult('declined')
      }
    } catch (error) {
      console.error('Error declining invite:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (actionResult) return <Processed actionResult={actionResult!} inviteInfo={inviteInfo} />

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mx-auto mb-6">
          <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">You&apos;re Invited!</h1>
        <p className="text-lg text-muted-foreground">
          {inviteInfo.inviter.name} has invited you to join <strong>{inviteInfo.teams.name}</strong>
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {/* <AvatarImage
                src={inviteInfo.teams?.avatar || '/placeholder.svg'}
                alt={inviteInfo.teams.name}
              /> */}
              <AvatarFallback className="text-lg">
                {inviteInfo.teams.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{inviteInfo.teams.name}</CardTitle>
              <CardDescription className="text-base">@{inviteInfo.teams.slug}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Invitation Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar>
              {/* <AvatarImage
                src={inviteInfo.inviter.avatar || '/placeholder.svg'}
                alt={inviteInfo.inviter.name}
              /> */}
              <AvatarFallback>{inviteInfo.inviter.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{inviteInfo.inviter.name}</p>
              <p className="text-sm text-muted-foreground">{inviteInfo.inviter.email}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-2">
                <TeamRoleIcon roleId={inviteInfo.role_id} />
                {inviteInfo.team_roles.name}
              </Badge>
              <span className="text-sm text-muted-foreground">Your role in the team</span>
            </div>
            <p className="text-sm text-muted-foreground">{inviteInfo.team_roles.description}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Invited</p>
                <p className="text-muted-foreground">
                  {dayjs(inviteInfo.created_at).format('MMMM D, YYYY [at] h:mm A')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Expires</p>
                <p className="text-muted-foreground">
                  {dayjs(inviteInfo.created_at).add(3, 'day').format('MMMM D, YYYY [at] h:mm A')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleAcceptInvite}
          disabled={isProcessing}
          className="flex-1 gap-2"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Accepting...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Accept Invitation
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleDeclineInvite}
          disabled={isProcessing}
          className="flex-1 gap-2 bg-transparent"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Declining...
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4" />
              Decline
            </>
          )}
        </Button>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          By accepting this invitation, you&apos;ll gain access to the team&apos;s projects and
          monitoring data according to your assigned role. You can leave the team at any time from
          your account settings.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default Valid
