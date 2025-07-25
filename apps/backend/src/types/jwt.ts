export interface JwtPayload {
  id: number
  email: string
  username: string
  iat?: number
  exp?: number
}
