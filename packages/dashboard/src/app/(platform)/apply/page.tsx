'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { CheckCircle, XCircle, UserPlus, Download } from 'lucide-react'
import useTeamRequests from '@/hooks/swr/useTeamRequests'
import useUserInfo from '@/hooks/swr/useUserInfo'
import { Skeleton } from '@/components/ui/skeleton'
import RequestCountCard from '@/components/apply/request-count-card'
import FilterCard from '@/components/apply/filter-card'
import { cn } from '@/utils/cn'
import ApplyItem from '@/components/apply/apply-item'

export default function TeamApplicationsPage() {
  const { user } = useUserInfo()
  const { teamRequests, counts, isLoading, error } = useTeamRequests(user?.team_id ?? 0)

  const [selectedApplyIds, setSelectedApplyIds] = useState<number[]>([])

  const CountList = useMemo(() => {
    return [
      {
        title: 'Total Applications',
        count: counts?.total,
        description: 'All time applications',
      },
      {
        title: 'Pending Review',
        count: counts?.pending,
        description: 'Awaiting your review',
      },
      {
        title: 'Approved',
        count: counts?.approved,
        description: 'Successfully approved',
      },
      {
        title: 'Rejected',
        count: counts?.rejected,
        description: 'Applications declined',
      },
    ]
  }, [counts])

  if (isLoading) return <Skeleton className="h-full w-full" />
  if (error) return <div>Error: {error.message}</div>

  const handleSelectApply = (checked: boolean, applyId: number) => {
    if (checked) {
      setSelectedApplyIds([...selectedApplyIds, applyId])
    } else {
      setSelectedApplyIds(selectedApplyIds.filter((id) => id !== applyId))
    }
  }

  const handleSelectAllApply = (checked: boolean) => {
    if (checked) {
      setSelectedApplyIds(teamRequests.map((item) => item.id))
    } else {
      setSelectedApplyIds([])
    }
  }

  const handleBatchAction = (action: 'approve' | 'reject') => {
    console.log(`Batch ${action} applications:`, selectedApplyIds)
    // 实际应用中这里会调用 API
    // setSelectedApplyIds([])
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Apply</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          {CountList.map((item) => (
            <RequestCountCard key={item.title} {...item} />
          ))}
        </div>

        <FilterCard />

        <Card
          className={cn({
            hidden: selectedApplyIds.length <= 0,
          })}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedApplyIds.length} application(s) selected
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchAction('approve')}
                  className="gap-2 bg-transparent"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchAction('reject')}
                  className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
                >
                  <XCircle className="h-4 w-4" />
                  Reject Selected
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Applications</CardTitle>
                <CardDescription>Review and manage applications to join your team</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    selectedApplyIds.length === teamRequests.length && teamRequests.length > 0
                  }
                  onCheckedChange={handleSelectAllApply}
                />
                <span className="text-sm text-muted-foreground">Select All</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamRequests.map((item) => (
                <ApplyItem
                  key={item.id}
                  data={item}
                  onChecked={handleSelectApply}
                  selectedApplyIds={selectedApplyIds}
                />
              ))}

              {teamRequests.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No applications found matching your criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
