export interface Project {
  id: string
  name: string
  created_at: Date
}

export interface UserProject {
  id: string
  user_id: string
  project_id: string
  role_id: string
  joined_at: Date
}
