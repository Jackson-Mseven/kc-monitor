import { z } from 'zod'

export const ProjectNameSchema = z.string().min(1, { message: '项目名不能为空' })

export const ProjectSchema = z.object({
  name: ProjectNameSchema,
})
