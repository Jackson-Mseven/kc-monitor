import { z } from 'zod'

export const IDSchema = z.string().min(1, { message: 'ID不能为空' })

export const generateNameSchema = (name: string) => {
  return z
    .string({ message: `${name}名称不能为空` })
    .min(1, { message: `${name}名称不能为空` })
    .max(30, { message: `${name}名称不能超过30个字符` })
}

export const generateSlugSchema = (name: string) => {
  return z
    .string({ message: `${name}标识不能为空` })
    .min(1, { message: `${name}标识不能为空` })
    .max(30, { message: `${name}标识不能超过30个字符` })
    .regex(/^[a-z0-9-]+$/, { message: `${name}标识只能包含小写字母(a-z)、数字(0-9)和中横线(-)` })
    .refine((val) => !val.startsWith('-') && !val.endsWith('-'), {
      message: `${name}标识不能以中横线开头或结尾`,
    })
}
