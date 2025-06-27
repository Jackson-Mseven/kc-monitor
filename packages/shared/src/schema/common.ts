import { z } from 'zod'

export const IDSchema = z.string().min(1, { message: 'ID不能为空' })
