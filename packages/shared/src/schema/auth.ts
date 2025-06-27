export * from '../constants/auth'
export * from '../types/auth'

import { z } from 'zod'
import { CODE_TYPE } from '../constants/auth'

export const CodeTypeSchema = z.enum(Object.values(CODE_TYPE) as [string, ...string[]])
