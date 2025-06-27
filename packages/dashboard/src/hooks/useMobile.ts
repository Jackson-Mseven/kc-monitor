import { useEffect, useState } from 'react'

/**
 * 判断当前设备是否为移动端的 hook
 * @returns {boolean} 是否为移动端
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function checkIsMobile() {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches)
    }

    checkIsMobile()

    window.addEventListener('resize', checkIsMobile)
    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])

  return isMobile
}
