import { TEMPLATES } from '@/app/(platform)/insights/projects/new/page'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/utils/cn'

interface TemplateSelectionProps {
  selectedTemplate: string
  setSelectedTemplate: (template: string) => void
  setStep: (step: number) => void
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  selectedTemplate,
  setSelectedTemplate,
  setStep,
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">选择项目类型</h1>
        <p className="text-muted-foreground">
          选择最适合您应用的技术栈，我们将为您提供定制化的集成指南
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {TEMPLATES.map((template) => {
          const Icon = template.icon
          const isSelected = selectedTemplate === template.id
          return (
            <Card
              key={template.id}
              className={cn('cursor-pointer transition-all duration-200 hover:shadow-lg', {
                'ring-2 ring-purple-500 shadow-lg': isSelected,
              })}
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
          <Link href="/insights/projects">
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
}

export default TemplateSelection
