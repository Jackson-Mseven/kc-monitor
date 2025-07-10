'use client'

import React, { useState } from 'react'
import { Card } from '../ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table'
import { Button } from '../ui/button'
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Link, ExternalLink, Settings, Trash2, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu'
import { PLATFORM_ICONS, STATUS_COLORS } from '@/app/(platform)/insights/projects/page'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const ProjectsTable = ({ projectsData }: { projectsData: any }) => {
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('name')}
                className="h-auto p-0 font-medium"
              >
                项目名称
                <ArrowUpDown className="w-4 h-4 ml-1" />
              </Button>
            </TableHead>
            <TableHead>状态</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('errors')}
                className="h-auto p-0 font-medium"
              >
                错误数
                <ArrowUpDown className="w-4 h-4 ml-1" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('performance')}
                className="h-auto p-0 font-medium"
              >
                性能
                <ArrowUpDown className="w-4 h-4 ml-1" />
              </Button>
            </TableHead>
            <TableHead>成员</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('lastEvent')}
                className="h-auto p-0 font-medium"
              >
                最后事件
                <ArrowUpDown className="w-4 h-4 ml-1" />
              </Button>
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projectsData.map((project: any) => {
            const PlatformIcon = PLATFORM_ICONS[project.platform as keyof typeof PLATFORM_ICONS]

            return (
              <TableRow key={project.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-muted rounded">
                      <PlatformIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground">{project.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={STATUS_COLORS[project.status as keyof typeof STATUS_COLORS]}>
                    {project.status === 'healthy'
                      ? '健康'
                      : project.status === 'warning'
                        ? '警告'
                        : '严重'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        project.errors > 50
                          ? 'text-red-600'
                          : project.errors > 20
                            ? 'text-yellow-600'
                            : 'text-green-600'
                      }
                    >
                      {project.errors}
                    </span>
                    {project.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      project.performance > 95
                        ? 'text-green-600'
                        : project.performance > 90
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }
                  >
                    {project.performance}%
                  </span>
                </TableCell>
                <TableCell>{project.members}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(project.lastEvent, { addSuffix: true, locale: zhCN })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}

export default ProjectsTable
