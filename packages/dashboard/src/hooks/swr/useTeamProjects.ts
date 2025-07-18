import { getFetcher } from '@/utils/fetcher'
import { Project, ProjectPlatform } from '@kc-monitor/shared'
import useSWR from 'swr'

export interface Filters {
  platform_id?: string
  search?: string
}

export interface TeamProject extends Project {
  project_platforms: ProjectPlatform
}

const useTeamProjects = (team_id: number, filters: Filters = {}) => {
  const { platform_id, search } = filters

  const queryParams = new URLSearchParams()
  queryParams.append('team_id', String(team_id))
  if (platform_id) queryParams.append('platform_id', String(platform_id))
  if (search) queryParams.append('search', search)
  const queryString = queryParams.toString()

  const { data, isLoading, error } = useSWR(`/project?${queryString}`, getFetcher)

  return {
    teamProjects: data?.data as TeamProject[],
    isLoading,
    error,
  }
}

export default useTeamProjects
