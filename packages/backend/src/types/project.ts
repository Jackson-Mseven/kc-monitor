import { Role } from './role'

export interface Project {
  id: number
  uuid: string
  created_at: Date
  team_id: number
  name: string
  slug: string
  description?: string
  versions: string[]
  platform_id: number
  is_archived: boolean
  updated_at?: Date
  pending_deletion: boolean
  deletion_scheduled_at?: Date
}

export type ProjectRole = Role
