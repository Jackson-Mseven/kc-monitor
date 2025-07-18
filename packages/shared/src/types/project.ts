import { PROJECT_PLATFORMS } from '../constants'
import { Role } from './role'

export interface Project {
  id: number
  uuid: string
  created_at: Date
  team_id: number
  name: string
  description?: string
  is_archived: boolean
  updated_at: Date
  pending_deletion: boolean
  deletion_scheduled_at?: Date
  platform_id: number
  dsn: string
}

export interface ProjectPlatform {
  id: ProjectPlatformId
  uuid: string
  name: string
  type: number
  install_command: string
  configuration: string
}

export type ProjectPlatformId = keyof typeof PROJECT_PLATFORMS
export type ProjectPlatformName = (typeof PROJECT_PLATFORMS)[ProjectPlatformId]

export type ProjectRole = Role

export interface ProjectVersion {
  id: number
  project_id: number
  version: string
  released_at?: Date
  is_stable: boolean
  is_latest: boolean
  changelog?: string
  metadata: Record<string, any>
  created_at: Date
  updated_at: Date
}
