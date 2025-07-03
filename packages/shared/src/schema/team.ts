import { z } from 'zod'
import { generateNameSchema, generateSlugSchema, IDSchema, makeAtLeastOneField } from './common'

export const TeamNameSchema = generateNameSchema('团队')

export const TeamSlugSchema = generateSlugSchema('团队')

export const TeamSchema = z.object({
  name: TeamNameSchema,
  slug: TeamSlugSchema,
})

export const TeamParamsSchema = z.object({
  id: IDSchema,
})

export const TeamRoleSchema = z.object({
  name: TeamNameSchema,
  description: z.string().optional(),
  permissions: z.array(z.string(), {
    message: '权限不能为空',
  }),
})

export const TeamRoleParamsSchema = z.object({
  role_id: IDSchema,
})

export const TeamUpdateSchema = makeAtLeastOneField(TeamSchema)

export const TeamUserParamsSchema = TeamParamsSchema.extend({
  user_id: IDSchema,
})

export const UpdateTeamUserRoleSchema = z.object({
  team_role_id: z.number({
    required_error: '团队角色ID不能为空',
    invalid_type_error: '团队角色ID类型错误',
  }),
})

export const InviteTeamUserSchema = z.object({
  email: z.string({ message: '邮箱不能为空' }).email({ message: '邮箱格式不正确' }),
  team_role_id: z.number({
    required_error: '团队角色ID不能为空',
    invalid_type_error: '团队角色ID类型错误',
  }),
})

export const InviteInfoSchema = z.object({
  token: z.string({ message: 'token不能为空' }),
})
