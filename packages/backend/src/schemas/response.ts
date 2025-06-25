import { z } from 'zod'

export const CustomResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.any(),
  error: z.any(),
  meta: z.object({}).optional(),
})
