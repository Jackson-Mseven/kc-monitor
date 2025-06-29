import { CustomResponse } from '@/types/response'
import { getFetcher } from '@/utils/fetcher'
import useSWR from 'swr'

const useUserTeam = () => {
  const { data, error, isLoading, mutate } = useSWR<CustomResponse>('/user/me/team', getFetcher)

  return {
    team: data?.data as {
      id: number
      uuid: string
      created_at: Date
      name: string
      slug: string
    },
    isLoading,
    error,
    refetch: mutate,
  }
}

export default useUserTeam
