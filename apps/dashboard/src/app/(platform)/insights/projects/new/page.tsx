'use client'

import type React from 'react'
import { useCallback, useState } from 'react'
import ProjectTypeSelection from '@/components/projects-new/project-type-selection'
import Configuration from '@/components/projects-new/configuration'
import Created from '@/components/projects-new/created'
import StepIndicator from '@/components/projects-new/step-indicator'
import { Project, ProjectPlatformId } from '@kc-monitor/shared'

const DEFAULT_STEP = 1

export default function NewProjectPage() {
  const [step, setStep] = useState(DEFAULT_STEP)
  const [selectedPlatformId, setSelectedPlatformId] = useState<ProjectPlatformId | null>(null)
  const [createdProject, setCreatedProject] = useState<Project | null>(null)

  /**
   * 重置创建项目状态
   */
  const refreshState = useCallback(() => {
    setStep(DEFAULT_STEP)
    setSelectedPlatformId(null)
    setCreatedProject(null)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <StepIndicator step={step} />

      {step === 1 && (
        <ProjectTypeSelection
          setStep={setStep}
          selectedPlatformId={selectedPlatformId}
          setSelectedPlatformId={setSelectedPlatformId}
        />
      )}
      {step === 2 && (
        <Configuration
          setStep={setStep}
          selectedPlatformId={selectedPlatformId}
          setCreatedProject={setCreatedProject}
        />
      )}
      {step === 3 && (
        <Created
          selectedPlatformId={selectedPlatformId!}
          createdProject={createdProject!}
          refreshState={refreshState}
        />
      )}
    </div>
  )
}
