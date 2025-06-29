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
