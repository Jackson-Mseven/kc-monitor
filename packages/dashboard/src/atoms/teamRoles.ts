import { atomWithQuery } from 'jotai-tanstack-query'
import { useAtomValue } from 'jotai'
import { getFetcher } from '@/utils/fetcher'

export interface TeamRole {
  id: number
  name: string
  description?: string
  permissions?: string[]
}

export const teamRolesAtom = atomWithQuery(() => ({
  queryKey: ['team-roles'],
  queryFn: async () => await getFetcher('/team/null/role'),
}))

export const useTeamRoles = (): TeamRole[] => {
  return useAtomValue(teamRolesAtom).data?.data ?? []
}
