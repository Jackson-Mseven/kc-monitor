import { z } from 'zod'
import { generateNameSchema, generateSlugSchema, IDSchema } from './common'

export const ProjectNameSchema = generateNameSchema('项目')

export const ProjectSlugSchema = generateSlugSchema('项目')

export const ProjectSchema = z.object({
  team_id: z.number({ message: '团队ID不能为空' }),
  name: ProjectNameSchema,
  slug: ProjectSlugSchema,
})

export const ProjectParamsSchema = z.object({
  id: IDSchema,
})
