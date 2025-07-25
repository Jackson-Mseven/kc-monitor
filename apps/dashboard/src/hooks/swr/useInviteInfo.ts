import { getFetcher } from '@/utils/fetcher'
import { InviteInfo } from '@kc-monitor/shared'
import { toast } from 'sonner'
import useSWR from 'swr'

const useInviteInfo = (token: string) => {
  const { data, isLoading, error } = useSWR(`/team/null/invite/info/${token}`, getFetcher)
  if (data?.code !== 200) {
    toast.error(data?.message)
  }

  return {
    inviteInfo: data?.data as InviteInfo,
    isLoading,
    error,
  }
}

export default useInviteInfo
