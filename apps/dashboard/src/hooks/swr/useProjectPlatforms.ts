import { projectPlatformsAtom } from '@/atoms/projectPlatforms'
import { ProjectPlatform } from '@kc-monitor/shared'
import { useAtomValue } from 'jotai'

export const useProjectPlatforms = () => {
  const { data, isLoading, error } = useAtomValue(projectPlatformsAtom)
  return {
    projectPlatforms: data?.data as ProjectPlatform[],
    isLoading,
    error,
  }
}

export default useProjectPlatforms
