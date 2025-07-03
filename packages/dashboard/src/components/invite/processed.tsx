import { InviteInfo } from '@kc-monitor/shared'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import React from 'react'

export interface ProcessedProps {
  actionResult: 'accepted' | 'declined'
  inviteInfo: InviteInfo
}

const Processed: React.FC<ProcessedProps> = ({ actionResult, inviteInfo }) => {
  return (
    <div className="text-center py-12">
      <div
        className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-6 ${
          actionResult === 'accepted'
            ? 'bg-green-100 dark:bg-green-900/20'
            : 'bg-gray-100 dark:bg-gray-900/20'
        }`}
      >
        {actionResult === 'accepted' ? (
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        ) : (
          <XCircle className="h-8 w-8 text-gray-600 dark:text-gray-400" />
        )}
      </div>
      <h2
        className={`text-2xl font-bold mb-2 ${
          actionResult === 'accepted'
            ? 'text-green-900 dark:text-green-100'
            : 'text-gray-900 dark:text-gray-100'
        }`}
      >
        {actionResult === 'accepted' ? 'Welcome to the Team!' : 'Invitation Declined'}
      </h2>
      <p className="text-muted-foreground mb-6">
        {actionResult === 'accepted'
          ? `You've successfully joined ${inviteInfo?.teams.name}. Redirecting to dashboard...`
          : "You've declined the team invitation. You can close this page."}
      </p>
      {actionResult === 'accepted' && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Redirecting to dashboard...
        </div>
      )}
    </div>
  )
}

export default Processed
