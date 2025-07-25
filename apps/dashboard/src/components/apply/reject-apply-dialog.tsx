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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { XCircle, AlertCircle, Loader2 } from 'lucide-react'
import { ReadTeamJoinRequest } from '@kc-monitor/shared'
import { toast } from 'sonner'
import { postFetcher } from '@/utils/fetcher'

interface RejectApplyDialogProps {
  application: ReadTeamJoinRequest
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function RejectApplyDialog({
  application,
  open,
  onOpenChange,
}: RejectApplyDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      const response = await postFetcher(
        `/team/${application.team_id}/apply/${application.id}/reject`,
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
    if (!isProcessing) {
      onOpenChange(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full ${'bg-red-100 dark:bg-red-900/20'}`}
            >
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle className={`text-xl font-semibold text-red-900 dark:text-red-100`}>
                Reject Application
              </DialogTitle>
              <DialogDescription>Decline this application with feedback</DialogDescription>
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

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Rejecting this application will:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Decline {application.users.name}&apos;s request to join</li>
                <li>Send them a notification email with your feedback</li>
                <li>Archive the application for future reference</li>
                <li>Allow them to reapply in the future if desired</li>
              </ul>
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
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Reject Application
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
