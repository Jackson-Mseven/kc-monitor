export const CODE_TYPE = {
  REGISTER: 'register',
  FORGET_PASSWORD: 'forget-password',
  LIMIT: 'limit',
} as const

export const TEAM_PERMISSIONS = {
  TEAM_READ: 'team:read',
  TEAM_WRITE: 'team:write',
  TEAM_MANAGE: 'team:manage',
  TEAM_DELETE: 'team:delete',
} as const

export const TEAM_ROLES = {
  OWNER: 1,
  ADMIN: 2,
  MEMBER: 3,
} as const
