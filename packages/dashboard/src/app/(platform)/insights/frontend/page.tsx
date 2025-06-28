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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Monitor, Smartphone, Globe, Zap, Clock, Eye } from 'lucide-react'
import ReactECharts from 'echarts-for-react'

const browserData = [
  { name: 'Chrome', value: 65.2, errors: 45 },
  { name: 'Safari', value: 18.3, errors: 12 },
  { name: 'Firefox', value: 8.7, errors: 8 },
  { name: 'Edge', value: 5.1, errors: 3 },
  { name: 'Others', value: 2.7, errors: 2 },
]

const deviceData = [
  { name: 'Desktop', value: 58.4, errors: 38 },
  { name: 'Mobile', value: 35.2, errors: 28 },
  { name: 'Tablet', value: 6.4, errors: 4 },
]

const performanceMetrics = {
  fcp: 1.2, // First Contentful Paint
  lcp: 2.1, // Largest Contentful Paint
  fid: 45, // First Input Delay (ms)
  cls: 0.08, // Cumulative Layout Shift
}

const browserUsageOption = {
  title: {
    text: 'Browser Usage',
    textStyle: { fontSize: 14, fontWeight: 'normal' },
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}% ({d}%)',
  },
  series: [
    {
      name: 'Browser Usage',
      type: 'pie',
      radius: ['40%', '70%'],
      data: browserData.map((item) => ({
        value: item.value,
        name: item.name,
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

const errorsByBrowserOption = {
  title: {
    text: 'Errors by Browser',
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
    data: browserData.map((b) => b.name),
  },
  yAxis: {
    type: 'value',
    name: 'Error Count',
  },
  series: [
    {
      data: browserData.map((b) => b.errors),
      type: 'bar',
      itemStyle: { color: '#ef4444' },
    },
  ],
}

const pageLoadTimeOption = {
  title: {
    text: 'Page Load Time Trends',
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
    name: 'Load Time (s)',
  },
  series: [
    {
      data: [2.1, 1.9, 2.3, 2.0, 1.8, 2.2, 2.4],
      type: 'line',
      smooth: true,
      itemStyle: { color: '#3b82f6' },
    },
  ],
}

export default function FrontendInsightsPage() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Insights</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Frontend</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
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
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2M</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+8.2%</span> from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Load Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.1s</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500">+0.2s</span> from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.3%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">-2.1%</span> from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">JS Errors</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500">+12</span> from last week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Browser Usage</CardTitle>
              <CardDescription>Distribution of users by browser</CardDescription>
            </CardHeader>
            <CardContent>
              <ReactECharts option={browserUsageOption} style={{ height: '300px' }} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Errors by Browser</CardTitle>
              <CardDescription>JavaScript errors grouped by browser</CardDescription>
            </CardHeader>
            <CardContent>
              <ReactECharts option={errorsByBrowserOption} style={{ height: '300px' }} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Page Load Performance</CardTitle>
            <CardDescription>Weekly page load time trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ReactECharts option={pageLoadTimeOption} style={{ height: '300px' }} />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Core Web Vitals</CardTitle>
              <CardDescription>Key performance metrics for user experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">First Contentful Paint (FCP)</p>
                  <p className="text-sm text-muted-foreground">Time to first content render</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{performanceMetrics.fcp}s</p>
                  <Badge variant={performanceMetrics.fcp <= 1.8 ? 'default' : 'destructive'}>
                    {performanceMetrics.fcp <= 1.8 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Largest Contentful Paint (LCP)</p>
                  <p className="text-sm text-muted-foreground">Time to largest content render</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{performanceMetrics.lcp}s</p>
                  <Badge variant={performanceMetrics.lcp <= 2.5 ? 'default' : 'destructive'}>
                    {performanceMetrics.lcp <= 2.5 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">First Input Delay (FID)</p>
                  <p className="text-sm text-muted-foreground">Time to first user interaction</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{performanceMetrics.fid}ms</p>
                  <Badge variant={performanceMetrics.fid <= 100 ? 'default' : 'destructive'}>
                    {performanceMetrics.fid <= 100 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cumulative Layout Shift (CLS)</p>
                  <p className="text-sm text-muted-foreground">Visual stability score</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{performanceMetrics.cls}</p>
                  <Badge variant={performanceMetrics.cls <= 0.1 ? 'default' : 'destructive'}>
                    {performanceMetrics.cls <= 0.1 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>User distribution by device type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {device.name === 'Desktop' && <Monitor className="h-4 w-4" />}
                    {device.name === 'Mobile' && <Smartphone className="h-4 w-4" />}
                    {device.name === 'Tablet' && <Monitor className="h-4 w-4" />}
                    <span className="font-medium">{device.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{device.value}%</p>
                    <p className="text-sm text-muted-foreground">{device.errors} errors</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top JavaScript Errors</CardTitle>
            <CardDescription>Most frequent frontend errors in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  error: "TypeError: Cannot read property 'map' of undefined",
                  count: 45,
                  file: 'components/UserList.jsx:23',
                },
                {
                  error: 'ReferenceError: $ is not defined',
                  count: 32,
                  file: 'utils/helpers.js:15',
                },
                {
                  error: "TypeError: Cannot read property 'length' of null",
                  count: 28,
                  file: 'pages/Dashboard.jsx:67',
                },
                { error: "SyntaxError: Unexpected token '<'", count: 21, file: 'api/config.js:8' },
                {
                  error: "TypeError: Cannot read property 'id' of undefined",
                  count: 18,
                  file: 'components/Profile.jsx:41',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-red-600">{item.error}</p>
                    <p className="text-sm text-muted-foreground">{item.file}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">{item.count}</Badge>
                    <p className="text-sm text-muted-foreground mt-1">occurrences</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
