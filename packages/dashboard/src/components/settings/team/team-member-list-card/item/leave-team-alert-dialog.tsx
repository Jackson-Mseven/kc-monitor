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
import { LogOut, Loader2, Users } from 'lucide-react'
import { deleteFetcher } from '@/utils/fetcher'
import { toast } from 'sonner'

interface LeaveTeamDialogProps {
  teamName: string
  userRole: string
}

export default function LeaveTeamDialog({ teamName, userRole }: LeaveTeamDialogProps) {
  const [isLeaving, setIsLeaving] = useState(false)
  const [open, setOpen] = useState(false)

  const handleConfirm = async () => {
    setIsLeaving(true)
    try {
      const response = await deleteFetcher(`/user/me/team`, {
        headers: {},
      })
      if (response.code === 200) {
        toast.success('You have left the team')
        window.location.reload()
        setOpen(false)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error leaving team:', error)
    } finally {
      setIsLeaving(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLeaving) {
      setOpen(newOpen)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-24">
          Leave
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[480px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <LogOut className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-semibold">Leave Team</AlertDialogTitle>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to leave &quot;{teamName}&quot;?
              </p>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4">
          <AlertDialogDescription className="text-sm text-muted-foreground space-y-3">
            <p>If you leave this team, you will:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
              <li>Lose access to all team projects and data</li>
              <li>No longer receive notifications for team activities</li>
              <li>Be removed from all team discussions and alerts</li>
              <li>Need to be re-invited to rejoin the team</li>
              {userRole !== 'Member' && <li>Lose your {userRole} privileges in this team</li>}
            </ul>
            <div className="bg-muted p-3 rounded-lg mt-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Your current role:</span>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-medium">
                  {userRole}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Your contributions and data will remain in the team, but you
              won&apos;t have access to them.
            </p>
          </AlertDialogDescription>
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel disabled={isLeaving} className="bg-transparent">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLeaving}
            className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-600"
          >
            {isLeaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Leaving Team...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Leave Team
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
