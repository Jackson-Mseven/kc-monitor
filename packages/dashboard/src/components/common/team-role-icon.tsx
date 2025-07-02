import React from 'react'
import { TEAM_ROLES } from '@kc-monitor/shared'
import { Crown, LucideProps, Shield, User } from 'lucide-react'

interface TeamRoleIconProps extends LucideProps {
  roleId: number
}

const TeamRoleIcon = ({ roleId, ...props }: TeamRoleIconProps) => {
  switch (roleId) {
    case TEAM_ROLES.OWNER:
      return <Crown {...props} />
    case TEAM_ROLES.ADMIN:
      return <Shield {...props} />
    default:
      return <User {...props} />
  }
}

export default TeamRoleIcon
