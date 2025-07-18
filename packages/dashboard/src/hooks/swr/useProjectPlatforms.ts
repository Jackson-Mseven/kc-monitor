import { getFetcher } from '@/utils/fetcher'
import { ProjectPlatform } from '@kc-monitor/shared'
import useSWR from 'swr'

const useProjectPlatforms = () => {
  const { data, isLoading, error } = useSWR('/project/platform', getFetcher)

  return {
    projectPlatforms: data?.data as ProjectPlatform[],
    isLoading,
    error,
  }
}

export default useProjectPlatforms
