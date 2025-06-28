import { Role } from './role'

export interface Team {
  id: number
  uuid: string
  created_at: Date
  name: string
  slug: string
}

export type TeamRole = Role
