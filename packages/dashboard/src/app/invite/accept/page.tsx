'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import useInviteInfo from '@/hooks/swr/useInviteInfo'
import { TEAM_JOIN_REQUEST_STATUS } from '@kc-monitor/shared'
import Loading from '@/components/invite/loading'
import Error from '@/components/invite/error'
import Expired from '@/components/invite/expired'
import Valid from '@/components/invite/valid'

export default function InviteAcceptPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const { inviteInfo, isLoading, error } = useInviteInfo(token ?? '')

  if (isLoading) return <Loading />
  if (!inviteInfo || error) return <Error />
  if (inviteInfo.status !== TEAM_JOIN_REQUEST_STATUS.PENDING)
    return <Expired inviteInfo={inviteInfo} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg px-6">
            <Valid inviteInfo={inviteInfo} />
          </Card>

          <div className="text-center mt-8">
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/login">
                <ExternalLink className="h-4 w-4" />
                Go to KC-Monitor Platform
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
