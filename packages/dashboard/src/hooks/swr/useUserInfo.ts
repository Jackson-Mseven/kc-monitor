import { userAtom } from '@/atoms/user'
import { CustomResponse } from '@/types/response'
import { getFetcher } from '@/utils/fetcher'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'

const useUserInfo = () => {
  const [user, setUser] = useAtom(userAtom)
  const router = useRouter()

  const { data, error, isLoading, mutate } = useSWR<CustomResponse>(
    user ? null : '/auth/me', // 有缓存就不发请求
    (url) => getFetcher(url, { credentials: 'include' }),
    {
      onSuccess: (response) => {
        if (response.code !== 200) {
          router.push('/login')
        }
        setUser(response.data)
      },
    }
  )

  return {
    user: user ?? data?.data,
    isLoading,
    error,
    refetch: mutate,
  }
}

export default useUserInfo
