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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CheckCircle, AlertCircle, Loader2, Mail } from 'lucide-react'
import { ReadTeamJoinRequest } from '@kc-monitor/shared'

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
  const [notes, setNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [sendNotification, setSendNotification] = useState(true)

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setNotes('')
    } catch (error) {
      console.error('Error processing application:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isProcessing) {
      onOpenChange(newOpen)
      if (!newOpen) {
        setNotes('')
      }
    }
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
          {/* 申请者信息 */}
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
            <Avatar>
              <AvatarFallback>{application.users.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{application.users.name}</p>
              <p className="text-sm text-muted-foreground">{application.users.email}</p>
            </div>
          </div>

          {/* 操作说明 */}
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

          {/* 备注输入 */}
          <div className="space-y-2">
            <Label htmlFor="notes">Welcome Message (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add a personal welcome message or any onboarding instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isProcessing}
              rows={4}
              maxLength={1000}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                <span className="text-destructive">Feedback is required for rejections</span>
              </span>
              <span>{notes.length}/1000 characters</span>
            </div>
          </div>

          {/* 通知选项 */}
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <input
              type="checkbox"
              id="sendNotification"
              checked={sendNotification}
              onChange={(e) => setSendNotification(e.target.checked)}
              disabled={isProcessing}
              className="rounded"
            />
            <Label htmlFor="sendNotification" className="flex items-center gap-2 cursor-pointer">
              <Mail className="h-4 w-4" />
              Send email notification to {application.users.name}
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing || notes.trim().length === 0}
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
