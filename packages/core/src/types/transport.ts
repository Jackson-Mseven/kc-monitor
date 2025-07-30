export interface TransportRequest {
  payload: string
}

export interface TransportResponse {
  statusCode?: number
  error?: Error
}

export type MakeRequest = (req: TransportRequest) => Promise<TransportResponse>

export interface TransportInterface {
  send: (payload: string) => Promise<TransportResponse>
  flush: () => Promise<boolean>
}
