import { atomWithQuery } from 'jotai-tanstack-query'
import { getFetcher } from '@/utils/fetcher'

export const projectPlatformsAtom = atomWithQuery(() => ({
  queryKey: ['project-platforms'],
  queryFn: async () => await getFetcher('/project/platform'),
}))
