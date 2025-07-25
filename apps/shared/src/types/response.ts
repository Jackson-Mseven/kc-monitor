export type CustomResponse<D = any, E = any> = {
  code: number
  message: string
  data: D
  error: E
  meta?: object
}
