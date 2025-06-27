import { z } from 'zod'

export const UserProjectSchema = z.object({
  user_id: z.string(),
  role_id: z.string(),
})
