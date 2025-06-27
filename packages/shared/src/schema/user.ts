import { z } from 'zod'
import { CodeTypeSchema } from './auth'

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

export const LoginSchema = UserSchema.pick({
  email: true,
  password: true,
})

export const RegisterSchema = UserSchema.extend({
  code: z.string(),
})

export const RegisterFormSchema = RegisterSchema.extend({
  confirmPassword: PasswordSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入密码不一致',
  path: ['confirmPassword'],
})

export const SendCodeSchema = z.object({ email: EmailSchema, type: CodeTypeSchema })

export const ForgetPasswordSchema = z.object({
  email: EmailSchema,
})

export const ResetPasswordSchema = z.object({
  token: z.string(),
  newPassword: PasswordSchema,
})
