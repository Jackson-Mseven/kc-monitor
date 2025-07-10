'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ArrowLeft,
  Code2,
  Rocket,
  CheckCircle,
  ExternalLink,
  Copy,
  Terminal,
  Globe,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ProjectTemplate {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: 'frontend' | 'backend' | 'mobile'
  popular: boolean
  setupSteps: string[]
  installCommand: string
  configExample: string
}

export default function NewProjectPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    platform: '',
    enablePerformance: true,
    enableProfiling: false,
    enableReleases: true,
  })
  const [isCreating, setIsCreating] = useState(false)
  const [createdProject, setCreatedProject] = useState<any>(null)

  const templates: ProjectTemplate[] = [
    {
      id: 'javascript',
      name: 'JavaScript',
      description: '纯 JavaScript 应用，支持浏览器和 Node.js 环境',
      icon: Code2,
      category: 'frontend',
      popular: true,
      setupSteps: ['安装 Sentry SDK', '初始化 Sentry 配置', '设置错误边界', '配置性能监控'],
      installCommand: 'npm install @sentry/browser',
      configExample: `import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "YOUR_DSN_HERE",
  environment: "production",
  tracesSampleRate: 1.0,
});`,
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      description: 'React 全栈框架，支持 SSR 和 SSG',
      icon: Globe,
      category: 'frontend',
      popular: true,
      setupSteps: [
        '安装 Next.js Sentry SDK',
        '配置 sentry.client.config.js',
        '配置 sentry.server.config.js',
        '设置 next.config.js',
      ],
      installCommand: 'npm install @sentry/nextjs',
      configExample: `// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "YOUR_DSN_HERE",
  tracesSampleRate: 1.0,
});`,
    },
    {
      id: 'react',
      name: 'React',
      description: '现代 React 应用，包括 Create React App 和 Vite',
      icon: Rocket,
      category: 'frontend',
      popular: true,
      setupSteps: ['安装 React Sentry SDK', '创建错误边界组件', '配置路由集成', '设置用户上下文'],
      installCommand: 'npm install @sentry/react',
      configExample: `import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_DSN_HERE",
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});`,
    },
  ]

  const handleCreateProject = async () => {
    setIsCreating(true)

    // 模拟项目创建
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newProject = {
      id: `proj_${Date.now()}`,
      name: projectData.name,
      description: projectData.description,
      platform: selectedTemplate,
      dsn: `https://example@o123456.ingest.sentry.io/123456`,
      created: new Date().toISOString(),
    }

    setCreatedProject(newProject)
    setIsCreating(false)
    setStep(3)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step >= stepNumber
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {step > stepNumber ? <CheckCircle className="w-4 h-4" /> : stepNumber}
            </div>
            {stepNumber < 3 && (
              <div
                className={`w-12 h-0.5 mx-2 ${step > stepNumber ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderTemplateSelection = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">选择项目类型</h1>
        <p className="text-muted-foreground">
          选择最适合您应用的技术栈，我们将为您提供定制化的集成指南
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {templates.map((template) => {
          const Icon = template.icon
          const isSelected = selectedTemplate === template.id
          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected ? 'ring-2 ring-purple-500 shadow-lg' : ''
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </div>
                  {template.popular && (
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                    >
                      热门
                    </Badge>
                  )}
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              {isSelected && (
                <CardContent className="pt-0">
                  <Separator className="mb-4" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">设置步骤：</h4>
                    {template.setupSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                        {step}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/insights/projects/empty">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Link>
        </Button>
        <Button
          onClick={() => setStep(2)}
          disabled={!selectedTemplate}
          className="bg-purple-600 hover:bg-purple-700"
        >
          下一步
        </Button>
      </div>
    </div>
  )

  const renderProjectConfiguration = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">配置项目</h1>
        <p className="text-muted-foreground">设置项目基本信息和监控选项</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>项目信息</CardTitle>
          <CardDescription>
            为您的 {templates.find((t) => t.id === selectedTemplate)?.name} 项目设置基本信息
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="project-name">项目名称 *</Label>
            <Input
              id="project-name"
              placeholder="例如：我的前端应用"
              value={projectData.name}
              onChange={(e) => setProjectData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">项目描述</Label>
            <Textarea
              id="project-description"
              placeholder="简要描述您的项目..."
              value={projectData.description}
              onChange={(e) => setProjectData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium">监控选项</h3>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="performance"
                checked={projectData.enablePerformance}
                onCheckedChange={(checked) =>
                  setProjectData((prev) => ({ ...prev, enablePerformance: checked as boolean }))
                }
              />
              <Label htmlFor="performance" className="text-sm">
                启用性能监控
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="profiling"
                checked={projectData.enableProfiling}
                onCheckedChange={(checked) =>
                  setProjectData((prev) => ({ ...prev, enableProfiling: checked as boolean }))
                }
              />
              <Label htmlFor="profiling" className="text-sm">
                启用性能分析 (Beta)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="releases"
                checked={projectData.enableReleases}
                onCheckedChange={(checked) =>
                  setProjectData((prev) => ({ ...prev, enableReleases: checked as boolean }))
                }
              />
              <Label htmlFor="releases" className="text-sm">
                启用版本追踪
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setStep(1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          上一步
        </Button>
        <Button
          onClick={handleCreateProject}
          disabled={!projectData.name.trim() || isCreating}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isCreating ? '创建中...' : '创建项目'}
        </Button>
      </div>
    </div>
  )

  const renderProjectCreated = () => {
    const template = templates.find((t) => t.id === selectedTemplate)!

    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">项目创建成功！</h1>
          <p className="text-muted-foreground">
            您的 {template.name} 项目已经创建完成，现在可以开始集成 Sentry SDK
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 项目信息 */}
          <Card>
            <CardHeader>
              <CardTitle>项目信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">项目名称</Label>
                <p className="text-sm text-muted-foreground">{createdProject?.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">项目 ID</Label>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-muted px-2 py-1 rounded">{createdProject?.id}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(createdProject?.id)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">DSN</Label>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                    {createdProject?.dsn}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(createdProject?.dsn)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 快速开始 */}
          <Card>
            <CardHeader>
              <CardTitle>快速开始</CardTitle>
              <CardDescription>按照以下步骤集成 Sentry SDK</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">1. 安装 SDK</Label>
                <div className="flex items-center gap-2 bg-muted p-3 rounded">
                  <Terminal className="w-4 h-4" />
                  <code className="text-sm flex-1">{template.installCommand}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(template.installCommand)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">2. 配置 Sentry</Label>
                <div className="bg-muted p-3 rounded">
                  <pre className="text-xs overflow-x-auto">
                    <code>
                      {template.configExample.replace('YOUR_DSN_HERE', createdProject?.dsn)}
                    </code>
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/insights/projects">查看项目</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs" target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" />
              查看文档
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setStep(1)
              setSelectedTemplate('')
              setProjectData({
                name: '',
                description: '',
                platform: '',
                enablePerformance: true,
                enableProfiling: false,
                enableReleases: true,
              })
              setCreatedProject(null)
            }}
          >
            创建另一个项目
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {renderStepIndicator()}

      {step === 1 && renderTemplateSelection()}
      {step === 2 && renderProjectConfiguration()}
      {step === 3 && renderProjectCreated()}
    </div>
  )
}
