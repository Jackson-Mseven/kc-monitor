'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckCircle, XCircle, UserPlus, Download } from 'lucide-react'
import useTeamRequests from '@/hooks/swr/useTeamRequests'
import useUserInfo from '@/hooks/swr/useUserInfo'
import { Skeleton } from '@/components/ui/skeleton'
import RequestCountCard from '@/components/apply/request-count-card'
import FilterCard, { DEFAULT_FILTER_VALUES, FilterFormData } from '@/components/apply/filter-card'
import { cn } from '@/utils/cn'
import ApplyItem from '@/components/apply/apply-item'
import { postFetcher } from '@/utils/fetcher'
import { toast } from 'sonner'

export default function TeamApplicationsPage() {
  const { user } = useUserInfo()

  const [filters, setFilters] = useState<FilterFormData>(DEFAULT_FILTER_VALUES)
  const { teamRequests, counts, isLoading, error } = useTeamRequests(user?.team_id ?? 0, filters)
  const countList = useMemo(
    () => [
      {
        title: 'Total Applications',
        count: counts?.total ?? 0,
        description: 'All time applications',
      },
      {
        title: 'Pending Review',
        count: counts?.pending ?? 0,
        description: 'Awaiting your review',
      },
      {
        title: 'Approved',
        count: counts?.approved ?? 0,
        description: 'Successfully approved',
      },
      {
        title: 'Rejected',
        count: counts?.rejected ?? 0,
        description: 'Applications declined',
      },
    ],
    [counts]
  )

  const [selectedApplyIds, setSelectedApplyIds] = useState<number[]>([])

  const handleFilterChange = useCallback((newFilters: FilterFormData) => {
    setSelectedApplyIds([])
    setFilters(newFilters)
  }, [])

  const handleSelectApply = useCallback(
    (checked: boolean, applyId: number) => {
      if (checked) {
        setSelectedApplyIds([...selectedApplyIds, applyId])
      } else {
        setSelectedApplyIds(selectedApplyIds.filter((id) => id !== applyId))
      }
    },
    [selectedApplyIds]
  )

  const handleSelectAllApply = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedApplyIds(teamRequests.map((item) => item.id))
      } else {
        setSelectedApplyIds([])
      }
    },
    [teamRequests]
  )

  const handleBatchAction = useCallback(
    async (action: 'approve' | 'reject') => {
      const response = await postFetcher(`/team/${user?.team_id}/apply/batch-${action}`, {
        body: {
          requestIds: selectedApplyIds,
        },
      })
      if (response.code === 200) {
        toast.success(response.message)
        setSelectedApplyIds([])
        window.location.reload()
      } else {
        toast.error(response.message)
      }
    },
    [selectedApplyIds, user?.team_id]
  )

  if (isLoading) return <Skeleton className="h-full w-full" />
  if (error) return <div>Error: {error.message}</div>

  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        {countList.map((item) => (
          <RequestCountCard key={item.title} {...item} />
        ))}
      </div>

      <FilterCard onFilter={handleFilterChange} initialValues={filters} />

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
                checked={selectedApplyIds.length === teamRequests.length && teamRequests.length > 0}
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
    </>
  )
}
