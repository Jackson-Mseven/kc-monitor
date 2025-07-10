import React from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/card'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu'
import { Link, MoreHorizontal, TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
  ExternalLink,
  Settings,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Activity,
  Users,
  Clock,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { PLATFORM_ICONS, STATUS_COLORS } from '@/app/(platform)/insights/projects/page'

const ProjectCard = (project: any) => {
  const PlatformIcon = PLATFORM_ICONS[project.platform as keyof typeof PLATFORM_ICONS]

  return (
    <Card key={project.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <PlatformIcon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription className="text-sm">{project.description}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>操作</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/insights/projects/${project.id}`}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  查看详情
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/insights/projects/${project.id}/settings`}>
                  <Settings className="w-4 h-4 mr-2" />
                  项目设置
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                删除项目
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className={STATUS_COLORS[project.status as keyof typeof STATUS_COLORS]}>
            {project.status === 'healthy' && <CheckCircle className="w-3 h-3 mr-1" />}
            {project.status === 'warning' && <AlertTriangle className="w-3 h-3 mr-1" />}
            {project.status === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
            {project.status === 'healthy' ? '健康' : project.status === 'warning' ? '警告' : '严重'}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {project.trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span>{project.trend === 'up' ? '改善' : '恶化'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>{project.errors} 错误</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <span>{project.performance}% 性能</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" />
            <span>{project.members} 成员</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{formatDistanceToNow(project.lastEvent, { addSuffix: true, locale: zhCN })}</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>环境: {project.environment}</span>
            <span>{project.releases} 个版本</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectCard
