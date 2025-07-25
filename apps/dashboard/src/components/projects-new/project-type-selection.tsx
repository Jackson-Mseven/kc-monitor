'use client'

import React from 'react'
import { Card, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Skeleton } from '../ui/skeleton'
import JsIcon from 'public/static/project/new/js.svg'
import ReactIcon from 'public/static/project/new/react.svg'
import NextjsIcon from 'public/static/project/new/nextjs.svg'
import { ProjectPlatformId } from '@kc-monitor/shared'
import { useProjectPlatforms } from '@/atoms/projectPlatforms'

interface TemplateSelectionProps {
  setStep: (step: number) => void
  selectedPlatformId: ProjectPlatformId | null
  setSelectedPlatformId: (id: ProjectPlatformId) => void
}

const PROJECT_PLATFORM_ICON_MAP: Record<
  ProjectPlatformId,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  0: JsIcon,
  1: ReactIcon,
  2: NextjsIcon,
} as const

const ProjectTypeSelection: React.FC<TemplateSelectionProps> = ({
  setStep,
  selectedPlatformId,
  setSelectedPlatformId,
}) => {
  const { projectPlatforms, isLoading, error } = useProjectPlatforms()

  if (isLoading) return <Skeleton className="w-full h-full" />
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">选择项目类型</h1>
        <p className="text-muted-foreground">
          选择最适合您应用的技术栈，我们将为您提供定制化的集成指南
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {projectPlatforms.map((platform) => {
          const Icon = PROJECT_PLATFORM_ICON_MAP[platform.id as ProjectPlatformId]
          const isSelected = selectedPlatformId === platform.id
          return (
            <Card
              key={platform.id}
              className={cn('cursor-pointer transition-all duration-200 hover:shadow-lg', {
                'ring-2 ring-purple-500 shadow-lg': isSelected,
              })}
              onClick={() => setSelectedPlatformId(platform.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-900/20 rounded-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                    {platform.name}
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/insights/projects">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Link>
        </Button>
        <Button
          onClick={() => setStep(2)}
          disabled={!Number.isInteger(selectedPlatformId)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          下一步
        </Button>
      </div>
    </div>
  )
}

export default ProjectTypeSelection
