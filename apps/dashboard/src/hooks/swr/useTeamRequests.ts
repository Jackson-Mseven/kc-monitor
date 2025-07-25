import { getFetcher } from '@/utils/fetcher'
import { ReadTeamJoinRequest } from '@kc-monitor/shared'
import useSWR from 'swr'

interface FilterParams {
  search?: string
  status?: number
}

const useTeamRequests = (teamId: number, filters: FilterParams = {}) => {
  const { search, status } = filters

  const queryParams = new URLSearchParams()
  if (search) queryParams.append('search', search)
  if (status !== undefined && status !== -1) queryParams.append('status', status.toString())

  const queryString = queryParams.toString()
  const endpoint = `/team/${teamId}/apply${queryString ? `?${queryString}` : ''}`

  const { data, isLoading, error, mutate } = useSWR(endpoint, getFetcher)

  return {
    teamRequests: (data?.data?.data ?? []) as ReadTeamJoinRequest[],
    counts: (data?.data?.counts ?? {}) as {
      total: number
      pending: number
      approved: number
      rejected: number
    },
    isLoading,
    error,
    mutate,
  }
}

export default useTeamRequests
