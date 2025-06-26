import { z } from 'zod'

export const UsernameSchema = z.string().min(1, { message: '用户名不能为空' })

export const PasswordSchema = z.string().min(6, { message: '密码至少6位' })

export const EmailSchema = z.string().email('不合法的 email 格式')

export const UserSchema = z.object({
  username: UsernameSchema,
  email: EmailSchema,
  password: PasswordSchema,
})
