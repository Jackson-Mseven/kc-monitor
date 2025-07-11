import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { TEMPLATES } from '@/app/(platform)/insights/projects/new/page'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { ArrowLeft } from 'lucide-react'
import { Textarea } from '../ui/textarea'

interface ConfigurationProps {
  projectData: any
  setProjectData: (data: any) => void
  selectedTemplate: string
  setStep: (step: number) => void
  setCreatedProject: (project: any) => void
}

const Configuration: React.FC<ConfigurationProps> = ({
  projectData,
  setProjectData,
  selectedTemplate,
  setStep,
  setCreatedProject,
}) => {
  const [isCreating, setIsCreating] = useState(false)

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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">配置项目</h1>
        <p className="text-muted-foreground">设置项目基本信息和监控选项</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>项目信息</CardTitle>
          <CardDescription>
            为您的 {TEMPLATES.find((t) => t.id === selectedTemplate)?.name} 项目设置基本信息
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
}

export default Configuration
