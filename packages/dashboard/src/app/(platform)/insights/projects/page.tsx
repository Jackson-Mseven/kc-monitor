'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FolderOpen, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react'
import ReactECharts from 'echarts-for-react'

const projectsData = [
  { name: 'Frontend App', errors: 45, performance: 98.2, status: 'healthy', trend: 'up' },
  { name: 'API Server', errors: 12, performance: 99.1, status: 'healthy', trend: 'up' },
  { name: 'User Service', errors: 78, performance: 95.8, status: 'warning', trend: 'down' },
  { name: 'Payment Gateway', errors: 3, performance: 99.8, status: 'healthy', trend: 'up' },
  { name: 'Background Worker', errors: 156, performance: 92.3, status: 'critical', trend: 'down' },
]

const projectErrorsOption = {
  title: {
    text: 'Project Error Distribution',
    textStyle: { fontSize: 14, fontWeight: 'normal' },
  },
  tooltip: {
    trigger: 'item',
  },
  series: [
    {
      type: 'pie',
      radius: '50%',
      data: projectsData.map((project) => ({
        value: project.errors,
        name: project.name,
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
}

const performanceComparisonOption = {
  title: {
    text: 'Performance Comparison',
    textStyle: { fontSize: 14, fontWeight: 'normal' },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  xAxis: {
    type: 'category',
    data: projectsData.map((p) => p.name),
    axisLabel: {
      rotate: 45,
    },
  },
  yAxis: {
    type: 'value',
    name: 'Performance Score (%)',
    min: 90,
    max: 100,
  },
  series: [
    {
      data: projectsData.map((p) => p.performance),
      type: 'bar',
      itemStyle: {
        color: (params: any) => {
          const score = params.value
          if (score >= 98) return '#22c55e'
          if (score >= 95) return '#eab308'
          return '#ef4444'
        },
      },
    },
  ],
}

export default function ProjectsInsightsPage() {
  return (
    <>
      <div className="ml-auto px-4">
        <Select defaultValue="7d">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectsData.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+2</span> new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Projects</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projectsData.filter((p) => p.status === 'healthy').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (projectsData.filter((p) => p.status === 'healthy').length / projectsData.length) *
                  100
              )}
              % of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projectsData.filter((p) => p.status === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Error Distribution</CardTitle>
            <CardDescription>Error count by project</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={projectErrorsOption} style={{ height: '300px' }} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Performance Comparison</CardTitle>
            <CardDescription>Performance scores across projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={performanceComparisonOption} style={{ height: '300px' }} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>Detailed view of all projects and their health status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectsData.map((project, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.errors} errors • {project.performance}% performance
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {project.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {project.trend === 'up' ? 'Improving' : 'Declining'}
                    </span>
                  </div>
                  <Badge
                    variant={
                      project.status === 'healthy'
                        ? 'default'
                        : project.status === 'warning'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {project.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
