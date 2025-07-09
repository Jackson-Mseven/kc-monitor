'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { ReadTeamJoinRequest } from '@kc-monitor/shared'
import { postFetcher } from '@/utils/fetcher'
import { toast } from 'sonner'

interface ApproveApplyDialogProps {
  application: ReadTeamJoinRequest
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ApproveApplyDialog({
  application,
  open,
  onOpenChange,
}: ApproveApplyDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      const response = await postFetcher(
        `/team/${application.team_id}/apply/${application.id}/approve`,
        {
          headers: {},
        }
      )
      if (response.code === 200) {
        onOpenChange(false)
        toast.success(response.message)
        window.location.reload()
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error processing application:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isProcessing) onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <DialogTitle className={`text-xl font-semibold text-green-900 dark:text-green-100`}>
                Approve Application
              </DialogTitle>
              <DialogDescription>Welcome this applicant to the team</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
            <Avatar>
              <AvatarFallback>{application.users.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{application.users.name}</p>
              <p className="text-sm text-muted-foreground">{application.users.email}</p>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <>
                <strong>Approving this application will:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Add {application.users.name} to the team</li>
                  <li>Grant them access to team projects and data</li>
                  <li>Send them a welcome email with next steps</li>
                  <li>Notify other team members about the new addition</li>
                </ul>
              </>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="bg-green-600 hover:bg-green-700 focus:ring-green-600"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Application
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
