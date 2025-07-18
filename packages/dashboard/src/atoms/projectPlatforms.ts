import { atomWithQuery } from 'jotai-tanstack-query'
import { useAtomValue } from 'jotai'
import { getFetcher } from '@/utils/fetcher'
import { ProjectPlatform } from '@kc-monitor/shared'

export const projectPlatformsAtom = atomWithQuery(() => ({
  queryKey: ['project-platforms'],
  queryFn: async () => await getFetcher('/project/platform'),
}))

export const useProjectPlatforms = () => {
  const { data, isLoading, error } = useAtomValue(projectPlatformsAtom)
  return {
    projectPlatforms: data?.data as ProjectPlatform[],
    isLoading,
    error,
  }
}
