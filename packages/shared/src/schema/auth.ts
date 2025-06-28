export * from '../constants/auth'
export * from '../types/auth'

import { z } from 'zod'
import { CODE_TYPE } from '../constants/auth'
import { EmailSchema, PasswordSchema, UserSchema } from './user'

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

export const CodeTypeSchema = z.enum(Object.values(CODE_TYPE) as [string, ...string[]])

export const SendCodeSchema = z.object({ email: EmailSchema, type: CodeTypeSchema })

export const ForgetPasswordSchema = z.object({
  email: EmailSchema,
})

export const ResetPasswordSchema = z.object({
  token: z.string(),
  newPassword: PasswordSchema,
})
