import { getFetcher } from '@/utils/fetcher'
import { ReadTeamJoinRequest } from '@kc-monitor/shared'
import useSWR from 'swr'

const useTeamRequests = (teamId: number) => {
  const { data, isLoading, error } = useSWR(`/team/${teamId}/apply`, getFetcher)
  return {
    teamRequests: data?.data.data as ReadTeamJoinRequest[],
    counts: data?.data.counts as {
      total: number
      pending: number
      approved: number
      rejected: number
    },
    isLoading,
    error,
  }
}

export default useTeamRequests
