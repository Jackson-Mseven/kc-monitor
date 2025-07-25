import { z } from 'zod'
import { generateNameSchema, IDSchema, makeAtLeastOneField } from './common'

export const UsernameSchema = generateNameSchema('用户名')

export const PasswordSchema = z
  .string()
  .min(8, { message: '密码至少8位' })
  .max(12, { message: '密码最多12位' })
  .refine((val) => /[\u4e00-\u9fa5a-zA-Z]/.test(val), {
    message: '密码需包含中文或英文字符',
  })

export const EmailSchema = z.string().email('不合法的 email 格式')

export const UserSchema = z.object({
  name: UsernameSchema,
  email: EmailSchema,
  password: PasswordSchema,
  team_id: z.number().optional(),
})

export const UserParamsSchema = z.object({
  id: IDSchema,
})

export const UserUpdateSchema = makeAtLeastOneField(UserSchema.pick({ name: true }))

export const UserUpdatePasswordSchema = z.object({
  password: PasswordSchema,
  newPassword: PasswordSchema,
})
