export interface Team {
  id: number
  uuid: string
  created_at: string
  name: string
  slug: string
}

export interface TeamRole {
  id: number
  uuid: string
  name: string
  description: string
  permissions: string
}
