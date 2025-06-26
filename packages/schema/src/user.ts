import { z } from 'zod'

export const UsernameSchema = z.string().min(1, { message: '用户名不能为空' })

export const PasswordSchema = z
  .string()
  .min(8, { message: '密码至少8位' })
  .max(12, { message: '密码最多12位' })
  .refine((val) => /[\u4e00-\u9fa5a-zA-Z]/.test(val), {
    message: '密码需包含中文或英文字符',
  })

export const EmailSchema = z.string().email('不合法的 email 格式')

export const UserSchema = z.object({
  username: UsernameSchema,
  email: EmailSchema,
  password: PasswordSchema,
})
