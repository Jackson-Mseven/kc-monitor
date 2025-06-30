import { CustomResponse, Team } from '@kc-monitor/shared'
import { getFetcher } from '@/utils/fetcher'
import useSWR from 'swr'

const useUserTeam = () => {
  const { data, error, isLoading, mutate } = useSWR<CustomResponse<Team>>(
    '/user/me/team',
    getFetcher
  )

  return {
    team: data?.data,
    isLoading,
    error,
    refetch: mutate,
  }
}

export default useUserTeam
