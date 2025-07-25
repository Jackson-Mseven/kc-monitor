'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CreateTeamDialog from './create-team-dialog'
import {
  Users,
  Mail,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  MessageSquare,
} from 'lucide-react'
import { postFetcher } from '@/utils/fetcher'
import { toast } from 'sonner'

export default function NoTeam() {
  const [teamSlug, setTeamSlug] = useState('')
  const [isJoining, setIsJoining] = useState(false)

  const handleApplyTeam = async () => {
    if (!teamSlug.trim()) return

    setIsJoining(true)
    try {
      const response = await postFetcher('/user/me/team/apply', {
        body: {
          slug: teamSlug,
        },
      })
      if (response.code === 201) {
        toast.success('申请加入团队成功')
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error('Error joining team:', error)
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to Sentry Platform</h1>
          <p className="text-xl text-muted-foreground mb-2">You&apos;re not part of any team yet</p>
          <p className="text-muted-foreground">
            Create a new team or join an existing one to start monitoring your applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Create New Team</CardTitle>
                  <CardDescription>Start fresh with your own team</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Full admin control
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Invite team members
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Configure projects
                </div>
              </div>

              <CreateTeamDialog />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full -translate-y-16 translate-x-16" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-500/10 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>Join Existing Team</CardTitle>
                  <CardDescription>Use an team slug</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Quick setup
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Access existing projects
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 text-purple-500" />
                  Collaborate immediately
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter team slug"
                  value={teamSlug}
                  onChange={(e) => setTeamSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                  disabled={isJoining}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleApplyTeam()
                    }
                  }}
                />
                <Button
                  onClick={handleApplyTeam}
                  disabled={!teamSlug.trim() || isJoining}
                  className="w-full gap-2 bg-transparent"
                  variant="outline"
                >
                  {isJoining ? 'Joining...' : 'Join Team'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-2xl mx-auto mt-16">
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-500/10 rounded-full mx-auto mb-4">
                <HelpCircle className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                We&apos;re here to help you get started with your team setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="gap-2 h-auto p-4 flex-col bg-transparent">
                  <MessageSquare className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-medium">Contact Support</div>
                    <div className="text-xs text-muted-foreground">Get help from our team</div>
                  </div>
                </Button>
                <Button variant="outline" className="gap-2 h-auto p-4 flex-col bg-transparent">
                  <HelpCircle className="h-5 w-5" />
                  <div className="text-center">
                    <div className="font-medium">View Documentation</div>
                    <div className="text-xs text-muted-foreground">Learn how teams work</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
