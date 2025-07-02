import { TEAM_PERMISSIONS, TEAM_ROLES } from '../constants'

export interface Team {
  id: number
  uuid: string
  created_at: string
  name: string
  slug: string
}

export interface TeamRole {
  id: number
  uuid: string
  name: string
  description: string
  permissions: string
}

export type TeamPermissionKeys = keyof typeof TEAM_PERMISSIONS
export type TeamPermissionValues = (typeof TEAM_PERMISSIONS)[TeamPermissionKeys]

export type TeamRoleKeys = keyof typeof TEAM_ROLES
export type TeamRoleValues = (typeof TEAM_ROLES)[TeamRoleKeys]
