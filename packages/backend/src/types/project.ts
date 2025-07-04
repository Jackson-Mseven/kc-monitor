import { Role } from './role'

export interface Project {
  id: number
  uuid: string
  created_at: Date
  team_id: number
  name: string
  slug: string
}

export type ProjectRole = Role
