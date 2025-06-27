import { getFetcher } from '@/utils/fetcher'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default () => {
  const router = useRouter()

  useEffect(() => {
    getFetcher('/auth/me', {
      credentials: 'include',
    }).then((res) => {
      if (res.code === 401) {
        toast.error(res.message)
        router.push('/login')
      }
    })
  })
}
