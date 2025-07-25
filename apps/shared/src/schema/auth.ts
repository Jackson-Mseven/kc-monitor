export * from '../constants/auth'
export * from '../types/auth'

import { z } from 'zod'
import { CODE_TYPE } from '../constants/auth'
import { EmailSchema, PasswordSchema, UserSchema } from './user'
import { CodeTypeValues } from '../types'

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

export const CodeTypeSchema = z
  .string({
    message: '验证码类型不能为空',
  })
  .superRefine((val, ctx) => {
    if (!Object.values(CODE_TYPE).includes(val as CodeTypeValues)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '验证码类型错误',
      })
    }
  })

export const SendCodeSchema = z.object({ email: EmailSchema, type: CodeTypeSchema })

export const ForgetPasswordSchema = z.object({
  email: EmailSchema,
})

export const ResetPasswordSchema = z.object({
  token: z.string(),
  newPassword: PasswordSchema,
})
