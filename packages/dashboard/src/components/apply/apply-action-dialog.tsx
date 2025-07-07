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
import { CheckCircle, XCircle, AlertCircle, Loader2, Mail } from 'lucide-react'

interface TeamApplication {
  id: string
  applicantName: string
  applicantEmail: string
  applicantAvatar?: string
  reason: string
  experience: string
  portfolio?: string
  linkedIn?: string
  github?: string
  appliedAt: string
  status: 'pending' | 'approved' | 'rejected'
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
  skills: string[]
  location?: string
}

interface ApplyActionDialogProps {
  application: TeamApplication
  action: 'approve' | 'reject'
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (notes: string) => void
}

export default function ApplyActionDialog({
  application,
  action,
  open,
  onOpenChange,
  onConfirm,
}: ApplyActionDialogProps) {
  const [notes, setNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [sendNotification, setSendNotification] = useState(true)

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1500))
      onConfirm(notes)
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

  const isApprove = action === 'approve'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full ${
                isApprove ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
              }`}
            >
              {isApprove ? (
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div>
              <DialogTitle
                className={`text-xl font-semibold ${isApprove ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}
              >
                {isApprove ? 'Approve Application' : 'Reject Application'}
              </DialogTitle>
              <DialogDescription>
                {isApprove
                  ? 'Welcome this applicant to the team'
                  : 'Decline this application with feedback'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* 申请者信息 */}
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
            <Avatar>
              <AvatarImage
                src={application.applicantAvatar || '/placeholder.svg'}
                alt={application.applicantName}
              />
              <AvatarFallback>
                {application.applicantName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{application.applicantName}</p>
              <p className="text-sm text-muted-foreground">{application.applicantEmail}</p>
            </div>
          </div>

          {/* 操作说明 */}
          <Alert variant={isApprove ? 'default' : 'destructive'}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {isApprove ? (
                <>
                  <strong>Approving this application will:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Add {application.applicantName} to the team</li>
                    <li>Grant them access to team projects and data</li>
                    <li>Send them a welcome email with next steps</li>
                    <li>Notify other team members about the new addition</li>
                  </ul>
                </>
              ) : (
                <>
                  <strong>Rejecting this application will:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Decline {application.applicantName}&apos;s request to join</li>
                    <li>Send them a notification email with your feedback</li>
                    <li>Archive the application for future reference</li>
                    <li>Allow them to reapply in the future if desired</li>
                  </ul>
                </>
              )}
            </AlertDescription>
          </Alert>

          {/* 备注输入 */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              {isApprove ? 'Welcome Message (Optional)' : 'Feedback for Applicant *'}
            </Label>
            <Textarea
              id="notes"
              placeholder={
                isApprove
                  ? 'Add a personal welcome message or any onboarding instructions...'
                  : 'Provide constructive feedback about why the application was not accepted...'
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isProcessing}
              rows={4}
              maxLength={1000}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {!isApprove && notes.trim().length === 0 && (
                  <span className="text-destructive">Feedback is required for rejections</span>
                )}
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
              Send email notification to {application.applicantName}
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing || (!isApprove && notes.trim().length === 0)}
            className={
              isApprove
                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-600'
                : 'bg-red-600 hover:bg-red-700 focus:ring-red-600'
            }
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {isApprove ? (
                  <CheckCircle className="mr-2 h-4 w-4" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                {isApprove ? 'Approve Application' : 'Reject Application'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
