import { CustomResponse } from '@/types/response'

type Input = RequestInfo | URL
type JsonBody = Record<string, any> | undefined
type Init = RequestInit
type Fetcher<I = Init> = (input: Input, init: I) => Promise<CustomResponse>
type GetFetcher<I = Init> = (input: Input, init?: I) => Promise<CustomResponse>
type InitWithCustomBody = Omit<RequestInit, 'body'> & { body?: JsonBody }
type FetcherWithCustomBody = Fetcher<InitWithCustomBody>

const baseFetcher: Fetcher = (input, init) =>
  fetch((process.env.NEXT_PUBLIC_API_URL as string) + input, init).then((res) => res.json())

export const getFetcher: GetFetcher = (input, init) =>
  baseFetcher(input, { ...init, method: 'GET' })

export const postFetcher: FetcherWithCustomBody = (input, init) =>
  baseFetcher(input, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
    method: 'POST',
    body: init.body ? JSON.stringify(init.body) : undefined,
  })

export const putFetcher: FetcherWithCustomBody = (input, init) =>
  baseFetcher(input, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
    method: 'PUT',
    body: init.body ? JSON.stringify(init.body) : undefined,
  })

export const deleteFetcher: FetcherWithCustomBody = (input, init) =>
  baseFetcher(input, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
    method: 'DELETE',
    body: init.body ? JSON.stringify(init.body) : undefined,
  })
