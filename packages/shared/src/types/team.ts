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

export interface TeamJoinRequest {
  id: number
  uuid: string
  created_at: string
  type: number
  status: number
  team_id: number
  user_id: number
  role_id: number
  created_by: number
  dispose_at?: string
}

export interface InviteInfo extends TeamJoinRequest {
  teams: {
    id: number
    name: string
    slug: string
  }
  users: {
    id: number
    name: string
    email: string
  }
  inviter: {
    id: number
    name: string
    email: string
  }
  team_roles: {
    id: number
    name: string
    description: string
  }
}
