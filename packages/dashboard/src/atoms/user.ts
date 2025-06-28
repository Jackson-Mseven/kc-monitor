import { atom } from 'jotai'

export interface User {
  id: number
  uuid: string
  name: string
  email: string
}

export const userAtom = atom<User | null>(null)
