import { UserAtom, userAtom } from '@/atoms/user'
import { getFetcher } from '@/utils/fetcher'
import { CustomResponse } from '@kc-monitor/shared'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'

/**
 * 获取当前登录的用户信息
 * @returns 用户信息
 */
const useUserInfo = () => {
  const [user, setUser] = useAtom(userAtom)
  const router = useRouter()

  const { data, error, isLoading, mutate } = useSWR<CustomResponse<UserAtom>>(
    user ? null : '/user/me', // 有缓存就不发请求
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
