import { z } from 'zod'
import { IDSchema } from './common'

export const ProjectMemberSchema = z.object({
  user_id: z.number(),
  project_id: z.number(),
  role_id: z.number(),
})

export const ProjectMemberParamsSchema = z.object({
  id: IDSchema,
  user_id: IDSchema,
})
