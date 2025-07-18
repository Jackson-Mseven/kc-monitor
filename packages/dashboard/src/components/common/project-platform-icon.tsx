import React from 'react'
import { ProjectPlatformId } from '@kc-monitor/shared'
import JsIcon from 'public/static/project/new/js.svg'
import ReactIcon from 'public/static/project/new/react.svg'
import NextjsIcon from 'public/static/project/new/nextjs.svg'

const PROJECT_PLATFORM_ICON_MAP: Record<
  ProjectPlatformId,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  0: JsIcon,
  1: ReactIcon,
  2: NextjsIcon,
} as const

interface ProjectPlatformIconProps extends React.SVGProps<SVGSVGElement> {
  projectPlatformId: ProjectPlatformId
}

const ProjectPlatformIcon: React.FC<ProjectPlatformIconProps> = ({
  projectPlatformId,
  ...props
}) => {
  const Icon = PROJECT_PLATFORM_ICON_MAP[projectPlatformId]
  return <Icon {...props} />
}

export default ProjectPlatformIcon
