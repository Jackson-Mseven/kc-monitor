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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { deleteFetcher } from '@/utils/fetcher'
import { toast } from 'sonner'

interface DisbandTeamDialogProps {
  teamId: number
  teamName: string
  teamSlug: string
}

export default function DisbandTeamDialog({ teamId, teamName, teamSlug }: DisbandTeamDialogProps) {
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [open, setOpen] = useState(false)

  const isConfirmValid = confirmText === teamSlug
  const expectedText = teamSlug

  const handleConfirm = async () => {
    if (!isConfirmValid) return

    setIsDeleting(true)
    try {
      const response = await deleteFetcher(`/team/${teamId}`)
      if (response.code === 200) {
        toast.success('Disbanded team')
        window.location.reload()
        setOpen(false)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error deleting team:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isDeleting) {
      setOpen(newOpen)
      if (!newOpen) {
        setConfirmText('')
      }
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-24">
          Disband
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-semibold text-red-900 dark:text-red-100">
                Delete Team
              </AlertDialogTitle>
              <p className="text-sm text-muted-foreground">This action cannot be undone</p>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> This will permanently delete the team &quot;{teamName}&quot;
              and all associated data.
            </AlertDescription>
          </Alert>

          <AlertDialogDescription className="text-sm text-muted-foreground space-y-2">
            <p>Deleting this team will:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Remove all team members and their access</li>
              <li>Delete all projects and their monitoring data</li>
              <li>Cancel any active subscriptions</li>
              <li>Remove all integrations and configurations</li>
              <li>Delete all error logs and performance data</li>
            </ul>
            <p className="font-medium text-foreground mt-3">
              This action is <span className="text-red-600 dark:text-red-400">irreversible</span>{' '}
              and all data will be lost forever.
            </p>
          </AlertDialogDescription>

          <div className="space-y-2">
            <Label htmlFor="confirm-input" className="text-sm font-medium">
              To confirm deletion, type{' '}
              <code className="bg-muted px-1 py-0.5 rounded text-sm">{expectedText}</code> below:
            </Label>
            <Input
              id="confirm-input"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Type "${expectedText}" to confirm`}
              disabled={isDeleting}
              className={
                confirmText && !isConfirmValid ? 'border-red-500 focus-visible:ring-red-500' : ''
              }
            />
            {confirmText && !isConfirmValid && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Please type &quot;{expectedText}&quot; exactly as shown above.
              </p>
            )}
          </div>
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel disabled={isDeleting} className="bg-transparent">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmValid || isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting Team...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Team Forever
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
