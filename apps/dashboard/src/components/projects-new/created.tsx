import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { CheckCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useProjectPlatforms } from '@/atoms/projectPlatforms'
import { Project, ProjectPlatform, ProjectPlatformId } from '@kc-monitor/shared'
import CommandCode from '../common/code/command-code'
import PreCode from '../common/code/pre-code'
import LineCode from '../common/code/line-code'

interface CreatedProps {
  selectedPlatformId: ProjectPlatformId
  createdProject: Project
  refreshState: () => void
}

const Created: React.FC<CreatedProps> = ({ selectedPlatformId, createdProject, refreshState }) => {
  const { projectPlatforms } = useProjectPlatforms()
  const platform = projectPlatforms.find(
    (platform) => selectedPlatformId === platform.id
  ) as ProjectPlatform

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4">项目创建成功！</h1>
        <p className="text-muted-foreground">
          您的 {platform?.name} 项目已经创建完成，现在可以开始集成 Sentry SDK
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
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
              <LineCode code={String(createdProject?.id)} />
            </div>
            <div>
              <Label className="text-sm font-medium">DSN</Label>
              <LineCode code={createdProject.dsn} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>快速开始</CardTitle>
            <CardDescription>按照以下步骤集成 Sentry SDK</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">1. 安装 SDK</Label>
              <CommandCode code={platform.install_command} />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">2. 配置 Sentry</Label>
              <PreCode code={platform.configuration.replace('{{dsn}}', createdProject.dsn)} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href={`/insights/projects/${createdProject.uuid}`}>查看项目</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/docs" target="_blank">
            <ExternalLink className="w-4 h-4 mr-2" />
            查看文档
          </Link>
        </Button>
        <Button variant="outline" onClick={refreshState}>
          创建另一个项目
        </Button>
      </div>
    </div>
  )
}

export default Created
