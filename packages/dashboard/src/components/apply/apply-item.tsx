import React, { useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { Avatar, AvatarFallback } from '../ui/avatar'
import {
  ReadTeamJoinRequest,
  TEAM_JOIN_REQUEST_STATUS,
  TEAM_JOIN_REQUEST_STATUS_TEXT,
  TeamJoinRequestStatusValues,
} from '@kc-monitor/shared'
import { Badge } from '../ui/badge'
import { Calendar, CheckCircle, Clock, Mail, XCircle } from 'lucide-react'
import { Button } from '../ui/button'
import ApproveApplyDialog from './approve-apply-dialog'
import RejectApplyDialog from './reject-apply-dialog'

const getStatusIcon = (status: number) => {
  switch (status) {
    case TEAM_JOIN_REQUEST_STATUS.PENDING:
      return <Clock className="h-4 w-4 text-yellow-500" />
    case TEAM_JOIN_REQUEST_STATUS.APPROVED:
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case TEAM_JOIN_REQUEST_STATUS.REJECTED:
      return <XCircle className="h-4 w-4 text-white" />
    case TEAM_JOIN_REQUEST_STATUS.CANCELLED:
      return <XCircle className="h-4 w-4" />
    default:
      return null
  }
}

const getStatusColor = (status: number) => {
  switch (status) {
    case TEAM_JOIN_REQUEST_STATUS.PENDING:
      return 'secondary'
    case TEAM_JOIN_REQUEST_STATUS.APPROVED:
      return 'default'
    case TEAM_JOIN_REQUEST_STATUS.REJECTED:
      return 'destructive'
    case TEAM_JOIN_REQUEST_STATUS.CANCELLED:
      return 'secondary'
    default:
      return 'secondary'
  }
}

interface ApplyItemProps {
  selectedApplyIds: number[]
  data: ReadTeamJoinRequest
  onChecked: (checked: boolean, id: number) => void
}

const ApplyItem = ({ selectedApplyIds, data, onChecked }: ApplyItemProps) => {
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  return (
    <>
      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <Checkbox
          checked={selectedApplyIds.includes(data.id)}
          onCheckedChange={(checked) => {
            onChecked(checked as boolean, data.id)
          }}
        />

        <Avatar className="h-12 w-12">
          <AvatarFallback>{data.users.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{data.users.name}</h3>
            <Badge variant={getStatusColor(data.status) as any} className="gap-1">
              {getStatusIcon(data.status)}
              {TEAM_JOIN_REQUEST_STATUS_TEXT[data.status as TeamJoinRequestStatusValues]}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {data.users.email}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(data.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {data.status === TEAM_JOIN_REQUEST_STATUS.PENDING && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApproveDialog(true)}
                className="gap-2 text-green-600 hover:text-green-700 bg-transparent"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRejectDialog(true)}
                className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            </>
          )}
        </div>
      </div>
      <ApproveApplyDialog
        application={data}
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
      />
      <RejectApplyDialog
        application={data}
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
      />
    </>
  )
}

export default ApplyItem
