export interface User {
  id: number
  uuid: string
  created_at: Date
  name: string
  email: string
  password: string
  team_id?: number | null
}
