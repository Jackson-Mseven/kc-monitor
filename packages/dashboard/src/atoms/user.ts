import { Team, TeamRole, User } from '@kc-monitor/shared'
import { atom } from 'jotai'

export type UserAtom =
  | (Omit<User, 'password'> & {
      teams: Team
      team_roles: TeamRole
    })
  | null

export const userAtom = atom<UserAtom>(null)
