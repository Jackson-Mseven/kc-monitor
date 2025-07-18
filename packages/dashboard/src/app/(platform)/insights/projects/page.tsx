'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import Filter, { VIEW_MODES, ViewModeId } from '@/components/projects/filter'
import Empty from '@/components/projects/empty'
import NoMatch from '@/components/projects/no-match'
import useTeamProjects, { Filters } from '@/hooks/swr/useTeamProjects'
import useUserInfo from '@/hooks/swr/useUserInfo'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProjectsPage() {
  const { user } = useUserInfo()
  const [filters, setFilters] = useState<Filters>({ search: '' })
  const { teamProjects, isLoading } = useTeamProjects(user?.team_id ?? 0, filters)

  const [viewMode, setViewMode] = useState<ViewModeId>(VIEW_MODES[0].id)

  const Projects = useMemo(
    () => VIEW_MODES.find((mode) => mode.id === viewMode)?.Component,
    [viewMode]
  )!

  if (isLoading) return <Skeleton className="w-full h-full" />
  if (teamProjects?.length === 0) return <Empty />
  if (teamProjects?.length === 0) return <NoMatch />

  return (
    <>
      <div className="ml-auto px-4">
        <Button asChild>
          <Link href="/insights/projects/new">
            <Plus className="w-4 h-4 mr-2" />
            创建项目
          </Link>
        </Button>
      </div>

      <Filter viewMode={viewMode} setViewMode={setViewMode} setFilters={setFilters} />

      <Projects list={teamProjects} />
    </>
  )
}
