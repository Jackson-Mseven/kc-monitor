import { getFetcher } from '@/utils/fetcher'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

/**
 * 检查用户是否登录
 */
export default () => {
  const router = useRouter()

  useEffect(() => {
    getFetcher('/user/me').then((res) => {
      if (res.code !== 200) {
        toast.error(res.message)
        router.push('/login')
      }
    })
  })
}
