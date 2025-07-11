'use client'

import type React from 'react'
import { useState } from 'react'
import { Code2, Rocket, Globe } from 'lucide-react'
import TemplateSelection from '@/components/projects-new/template-selection'
import Configuration from '@/components/projects-new/configuration'
import Created from '@/components/projects-new/created'
import StepIndicator from '@/components/projects-new/step-indicator'

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

export const TEMPLATES: ProjectTemplate[] = [
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

export default function NewProjectPage() {
  const [step, setStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    platform: '',
    enablePerformance: true,
    enableProfiling: false,
    enableReleases: true,
  })
  const [createdProject, setCreatedProject] = useState<any>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <StepIndicator step={step} />

      {step === 1 && (
        <TemplateSelection
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          setStep={setStep}
        />
      )}
      {step === 2 && (
        <Configuration
          projectData={projectData}
          setProjectData={setProjectData}
          selectedTemplate={selectedTemplate}
          setStep={setStep}
          setCreatedProject={setCreatedProject}
        />
      )}
      {step === 3 && (
        <Created
          selectedTemplate={selectedTemplate}
          createdProject={createdProject}
          setStep={setStep}
          setSelectedTemplate={setSelectedTemplate}
          setProjectData={setProjectData}
          setCreatedProject={setCreatedProject}
        />
      )}
    </div>
  )
}
