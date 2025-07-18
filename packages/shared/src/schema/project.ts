import { z } from 'zod'
import { generateNameSchema, IDSchema, makeAtLeastOneField } from './common'

export const ProjectNameSchema = generateNameSchema('项目')

export const ProjectSchema = z.object({
  id: z.number(),
  uuid: z.string(),
  created_at: z.string().date(),
  team_id: z.number({ message: '团队ID不能为空' }),
  name: ProjectNameSchema,
  description: z.string().optional(),
  is_archived: z.boolean(),
  updated_at: z.date(),
  pending_deletion: z.boolean(),
  deletion_scheduled_at: z.string().date().optional(),
  platform_id: z.number({ message: '项目类型不能为空' }),
  dsn: z.string(),
})

export const ProjectParamsSchema = z.object({
  id: IDSchema,
})

export const ProjectQuerySchema = z.object({
  team_id: z.string(),
  platform_id: z.string().optional(),
  search: z.string().optional(),
})

export const CreateProjectSchema = ProjectSchema.pick({
  team_id: true,
  name: true,
  description: true,
  platform_id: true,
})

export const UpdateProjectSchema = makeAtLeastOneField(
  ProjectSchema.pick({
    name: true,
    description: true,
  })
)

export const ProjectsFilterSchema = z.object({
  search: z.string().optional(),
  platform: z.string().optional(),
})
