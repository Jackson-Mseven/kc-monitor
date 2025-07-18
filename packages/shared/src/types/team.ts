import { TEAM_JOIN_REQUEST_STATUS, TEAM_PERMISSIONS, TEAM_ROLES } from '../constants'
import { Role } from './role'
import { User } from './user'

export interface Team {
  id: number
  uuid: string
  created_at: string
  name: string
  slug: string
}

export type TeamRole = Role

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

export interface ReadTeamJoinRequest extends TeamJoinRequest {
  users: Pick<User, 'id' | 'name' | 'email'>
  team_roles: Pick<TeamRole, 'id' | 'name'>
}

export type TeamJoinRequestStatusKeys = keyof typeof TEAM_JOIN_REQUEST_STATUS
export type TeamJoinRequestStatusValues =
  (typeof TEAM_JOIN_REQUEST_STATUS)[TeamJoinRequestStatusKeys]
