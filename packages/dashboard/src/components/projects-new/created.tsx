import React from 'react'
import { TEMPLATES } from '@/app/(platform)/insights/projects/new/page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { CheckCircle, Copy, ExternalLink, Terminal } from 'lucide-react'
import Link from 'next/link'

interface CreatedProps {
  selectedTemplate: string
  createdProject: any
  setStep: (step: number) => void
  setSelectedTemplate: (template: string) => void
  setProjectData: (data: any) => void
  setCreatedProject: (project: any) => void
}

const Created: React.FC<CreatedProps> = ({
  selectedTemplate,
  createdProject,
  setStep,
  setSelectedTemplate,
  setProjectData,
  setCreatedProject,
}) => {
  const template = TEMPLATES.find((t) => t.id === selectedTemplate)!

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

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

export default Created
