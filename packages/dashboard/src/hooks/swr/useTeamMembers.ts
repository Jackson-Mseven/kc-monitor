import { getFetcher } from '@/utils/fetcher'
import { User } from '@kc-monitor/shared'
import useSWR from 'swr'

const useTeamMembers = () => {
  const { data, isLoading, error } = useSWR('/team/me/members', getFetcher)
  return {
    teamMembers: data?.data as Omit<User, 'password'>[],
    isLoading,
    error,
  }
}

export default useTeamMembers
