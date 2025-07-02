import { CODE_TYPE } from '../constants'

export type CodeTypeKeys = keyof typeof CODE_TYPE
export type CodeTypeValues = (typeof CODE_TYPE)[CodeTypeKeys]
