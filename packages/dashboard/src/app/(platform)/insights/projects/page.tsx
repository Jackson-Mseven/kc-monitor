'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarInset } from '@/components/ui/sidebar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FolderOpen,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Search,
  Plus,
  MoreHorizontal,
  Settings,
  Trash2,
  ExternalLink,
  Activity,
  Clock,
  Users,
  Code2,
  Globe,
  Rocket,
  Filter,
  ArrowUpDown,
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

// 模拟项目数据
const projectsData = [
  {
    id: 'proj_1',
    name: 'Frontend Dashboard',
    description: '主要的前端仪表板应用',
    platform: 'react',
    status: 'healthy',
    errors: 12,
    performance: 98.2,
    trend: 'up',
    lastEvent: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
    members: 8,
    releases: 15,
    environment: 'production',
    created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30天前
  },
  {
    id: 'proj_2',
    name: 'API Gateway',
    description: '核心 API 网关服务',
    platform: 'nextjs',
    status: 'warning',
    errors: 45,
    performance: 95.8,
    trend: 'down',
    lastEvent: new Date(Date.now() - 1000 * 60 * 5), // 5分钟前
    members: 12,
    releases: 28,
    environment: 'production',
    created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60天前
  },
  {
    id: 'proj_3',
    name: 'Mobile App Backend',
    description: '移动应用后端服务',
    platform: 'javascript',
    status: 'critical',
    errors: 156,
    performance: 89.3,
    trend: 'down',
    lastEvent: new Date(Date.now() - 1000 * 60 * 2), // 2分钟前
    members: 6,
    releases: 42,
    environment: 'production',
    created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), // 90天前
  },
  {
    id: 'proj_4',
    name: 'Analytics Service',
    description: '数据分析和报告服务',
    platform: 'nextjs',
    status: 'healthy',
    errors: 3,
    performance: 99.1,
    trend: 'up',
    lastEvent: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
    members: 4,
    releases: 8,
    environment: 'production',
    created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15天前
  },
  {
    id: 'proj_5',
    name: 'User Authentication',
    description: '用户认证和授权系统',
    platform: 'react',
    status: 'healthy',
    errors: 8,
    performance: 97.5,
    trend: 'up',
    lastEvent: new Date(Date.now() - 1000 * 60 * 45), // 45分钟前
    members: 10,
    releases: 22,
    environment: 'production',
    created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45), // 45天前
  },
]

const platformIcons = {
  react: Rocket,
  nextjs: Globe,
  javascript: Code2,
}

const statusColors = {
  healthy: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const filteredAndSortedProjects = useMemo(() => {
    const filtered = projectsData.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter
      const matchesPlatform = platformFilter === 'all' || project.platform === platformFilter

      return matchesSearch && matchesStatus && matchesPlatform
    })

    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'errors':
          aValue = a.errors
          bValue = b.errors
          break
        case 'performance':
          aValue = a.performance
          bValue = b.performance
          break
        case 'lastEvent':
          aValue = a.lastEvent.getTime()
          bValue = b.lastEvent.getTime()
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [searchQuery, statusFilter, platformFilter, sortBy, sortOrder])

  const stats = useMemo(() => {
    const total = projectsData.length
    const healthy = projectsData.filter((p) => p.status === 'healthy').length
    const warning = projectsData.filter((p) => p.status === 'warning').length
    const critical = projectsData.filter((p) => p.status === 'critical').length
    const totalErrors = projectsData.reduce((sum, p) => sum + p.errors, 0)
    const avgPerformance = projectsData.reduce((sum, p) => sum + p.performance, 0) / total

    return { total, healthy, warning, critical, totalErrors, avgPerformance }
  }, [])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const renderProjectCard = (project: any) => {
    const PlatformIcon = platformIcons[project.platform as keyof typeof platformIcons]

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
            <Badge className={statusColors[project.status as keyof typeof statusColors]}>
              {project.status === 'healthy' && <CheckCircle className="w-3 h-3 mr-1" />}
              {project.status === 'warning' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {project.status === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {project.status === 'healthy'
                ? '健康'
                : project.status === 'warning'
                  ? '警告'
                  : '严重'}
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
              <span>
                {formatDistanceToNow(project.lastEvent, { addSuffix: true, locale: zhCN })}
              </span>
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

  const renderProjectTable = () => (
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
          {filteredAndSortedProjects.map((project) => {
            const PlatformIcon = platformIcons[project.platform as keyof typeof platformIcons]

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
                  <Badge className={statusColors[project.status as keyof typeof statusColors]}>
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

  // 如果没有项目，显示空状态
  const emptyState = (
    <SidebarInset>
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">还没有项目</h3>
          <p className="text-muted-foreground mb-4">创建您的第一个项目开始监控应用</p>
          <Button asChild>
            <Link href="/insights/projects/new">
              <Plus className="w-4 h-4 mr-2" />
              创建项目
            </Link>
          </Button>
        </div>
      </div>
    </SidebarInset>
  )

  const noMatchState = (
    <Card className="flex flex-1 items-center justify-center p-8">
      <div className="text-center">
        <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">未找到匹配的项目</h3>
        <p className="text-muted-foreground">尝试调整搜索条件或筛选器</p>
      </div>
    </Card>
  )

  return (
    <>
      <div className="ml-auto px-4">
        <Button asChild>
          <Link href="/insights/projects/new">
            <Plus className="w-4 h-4 mr-2" />
            创建项目
          </Link>
        </Button>
      </div>
      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总项目数</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">{stats.healthy}</span> 健康项目
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总错误数</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalErrors}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">{stats.critical}</span> 严重项目
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均性能</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgPerformance.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">所有项目平均值</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">警告项目</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.warning}</div>
            <p className="text-xs text-muted-foreground">需要关注的项目</p>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-4 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索项目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有状态</SelectItem>
              <SelectItem value="healthy">健康</SelectItem>
              <SelectItem value="warning">警告</SelectItem>
              <SelectItem value="critical">严重</SelectItem>
            </SelectContent>
          </Select>

          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有平台</SelectItem>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="nextjs">Next.js</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
            </SelectContent>
          </Select>

          <Select value={viewMode} onValueChange={(value: 'grid' | 'table') => setViewMode(value)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">网格</SelectItem>
              <SelectItem value="table">表格</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 项目列表 */}
      {projectsData.length === 0 ? (
        emptyState
      ) : filteredAndSortedProjects.length === 0 ? (
        noMatchState
      ) : viewMode === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedProjects.map(renderProjectCard)}
        </div>
      ) : (
        renderProjectTable()
      )}
    </>
  )
}
