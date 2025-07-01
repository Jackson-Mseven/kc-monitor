import React from 'react'
import useUserInfo from '@/hooks/swr/useUserInfo'

/**
 * HOC: 权限校验，没权限时传递 disabled
 * @param permission 需要的权限字符串
 */
export default function withTeamPermission<P extends { disabled?: boolean }>(
  WrappedComponent: React.ComponentType<P>,
  permission: string,
  additionalDisables: boolean = false
) {
  return function PermissionWrapper(props: P) {
    const { user, isLoading } = useUserInfo()

    if (isLoading) return null
    if (!user) return null
    const hasPermission = user?.team_roles?.permissions?.includes(permission)

    // 如果无权限，传递 disabled: true
    return <WrappedComponent {...props} disabled={!hasPermission || additionalDisables} />
  }
}
