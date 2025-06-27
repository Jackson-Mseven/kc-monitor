'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { AlertTriangle, Users, Activity, Clock } from 'lucide-react'
import ReactECharts from 'echarts-for-react'

const errorTrendOption = {
  title: {
    text: 'Error Trends',
    textStyle: { fontSize: 14, fontWeight: 'normal' },
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'line',
      smooth: true,
      itemStyle: { color: '#ef4444' },
    },
  ],
}

const performanceOption = {
  title: {
    text: 'Performance Metrics',
    textStyle: { fontSize: 14, fontWeight: 'normal' },
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  },
  yAxis: {
    type: 'value',
    name: 'Response Time (ms)',
  },
  series: [
    {
      data: [320, 280, 250, 300, 280, 320],
      type: 'bar',
      itemStyle: { color: '#3b82f6' },
    },
  ],
}

export default function DashboardPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Platform</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500">+12%</span> from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,543</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+5%</span> from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.2%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+0.5%</span> from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245ms</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">-15ms</span> from last week
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Error Trends</CardTitle>
              <CardDescription>Weekly error occurrence patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ReactECharts option={errorTrendOption} style={{ height: '300px' }} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Average response time throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ReactECharts option={performanceOption} style={{ height: '300px' }} />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Issues</CardTitle>
            <CardDescription>Latest errors and performance issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  type: 'error',
                  message: "TypeError: Cannot read property 'map' of undefined",
                  project: 'Frontend App',
                  time: '2 minutes ago',
                  severity: 'high',
                },
                {
                  type: 'warning',
                  message: 'Slow database query detected',
                  project: 'API Server',
                  time: '5 minutes ago',
                  severity: 'medium',
                },
                {
                  type: 'error',
                  message: 'Failed to load user preferences',
                  project: 'User Service',
                  time: '10 minutes ago',
                  severity: 'low',
                },
                {
                  type: 'info',
                  message: 'High memory usage detected',
                  project: 'Background Worker',
                  time: '15 minutes ago',
                  severity: 'medium',
                },
              ].map((issue, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        issue.severity === 'high'
                          ? 'bg-red-500'
                          : issue.severity === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                      }`}
                    />
                    <div>
                      <p className="font-medium">{issue.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {issue.project} • {issue.time}
                      </p>
                    </div>
                  </div>
                  <Badge variant={issue.severity === 'high' ? 'destructive' : 'secondary'}>
                    {issue.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
