import { CODE_TYPE, TEAM_PERMISSIONS } from '../constants/auth'

export type CodeTypeKeys = keyof typeof CODE_TYPE
export type CodeTypeValues = (typeof CODE_TYPE)[CodeTypeKeys]

export type TeamPermissionKeys = keyof typeof TEAM_PERMISSIONS
export type TeamPermissionValues = (typeof TEAM_PERMISSIONS)[TeamPermissionKeys]
