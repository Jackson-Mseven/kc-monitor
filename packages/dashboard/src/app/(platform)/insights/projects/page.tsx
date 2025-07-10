'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { FolderOpen, AlertTriangle, Plus, Activity, Code2, Globe, Rocket } from 'lucide-react'
import Link from 'next/link'
import CountCard from '@/components/projects/count-card'
import ProjectsFilter from '@/components/projects/filter'
import Empty from '@/components/projects/empty'
import NoMatch from '@/components/projects/no-match'
import ProjectCard from '@/components/projects/projects-card'
import ProjectsTable from '@/components/projects/projects-table'

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

export const PLATFORM_ICONS = {
  react: Rocket,
  nextjs: Globe,
  javascript: Code2,
}

export const STATUS_COLORS = {
  healthy: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
}

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const stats = useMemo(() => {
    const total = projectsData.length
    const healthy = projectsData.filter((p) => p.status === 'healthy').length
    const warning = projectsData.filter((p) => p.status === 'warning').length
    const critical = projectsData.filter((p) => p.status === 'critical').length
    const totalErrors = projectsData.reduce((sum, p) => sum + p.errors, 0)
    const avgPerformance = projectsData.reduce((sum, p) => sum + p.performance, 0) / total

    return { total, healthy, warning, critical, totalErrors, avgPerformance }
  }, [])

  const countList = useMemo(
    () => [
      {
        title: '总项目数',
        value: stats.total,
        description: (
          <>
            <span className="text-green-500">{stats.healthy}</span> 健康项目
          </>
        ),
        Icon: FolderOpen,
      },
      {
        title: '总错误数',
        value: stats.totalErrors,
        description: (
          <>
            <span className="text-red-500">{stats.critical}</span> 严重项目
          </>
        ),
        Icon: AlertTriangle,
      },
      {
        title: '平均性能',
        value: stats.avgPerformance.toFixed(1) + '%',
        description: '所有项目平均值',
        Icon: Activity,
      },
      {
        title: '警告项目',
        value: stats.warning,
        description: '需要关注的项目',
        Icon: AlertTriangle,
      },
    ],
    [stats]
  )

  if (projectsData.length === 0) return <Empty />
  if (projectsData.length === 0) return <NoMatch />

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
      <div className="grid gap-4 md:grid-cols-4">
        {countList.map((item) => (
          <CountCard key={item.title} {...item} />
        ))}
      </div>

      <ProjectsFilter viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projectsData.map((item) => (
            <ProjectCard key={item.id} {...item} />
          ))}
        </div>
      ) : (
        <ProjectsTable projectsData={projectsData} />
      )}
    </>
  )
}
