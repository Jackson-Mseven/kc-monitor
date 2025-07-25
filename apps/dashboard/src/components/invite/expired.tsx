import { Clock, Link } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { InviteInfo } from '@kc-monitor/shared'
import dayjs from 'dayjs'

const Expired: React.FC<{ inviteInfo: InviteInfo }> = ({ inviteInfo }) => {
  return (
    <div className="text-center py-12">
      <div className="flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full mx-auto mb-6">
        <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
      </div>
      <h2 className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-2">
        Invitation Expired
      </h2>
      <p className="text-muted-foreground mb-6">
        This invitation has expired. Please contact the team administrator for a new invitation.
      </p>
      {inviteInfo && (
        <div className="bg-muted p-4 rounded-lg mb-6 text-left max-w-md mx-auto">
          <p className="text-sm">
            <strong>Team:</strong> {inviteInfo.teams.name}
          </p>
          <p className="text-sm">
            <strong>Invited by:</strong> {inviteInfo.inviter.name}
          </p>
          <p className="text-sm">
            <strong>Expired:</strong>{' '}
            {dayjs(inviteInfo.created_at).format('MMMM D, YYYY [at] h:mm A')}
          </p>
        </div>
      )}
      <Button variant="outline" asChild>
        <Link href="/login">Go to Login</Link>
      </Button>
    </div>
  )
}

export default Expired
