import { Env } from 'src/types/env'

export const ENV = {
  PORT: 3000,
  HOST: '0.0.0.0',
} satisfies Env

export const IS_DEV = process.env.NODE_ENV !== 'production'
