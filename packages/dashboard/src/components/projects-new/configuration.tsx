'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ArrowLeft } from 'lucide-react'
import { Textarea } from '../ui/textarea'
import { useProjectPlatforms } from '@/atoms/projectPlatforms'
import { Skeleton } from '../ui/skeleton'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { postFetcher } from '@/utils/fetcher'
import useUserInfo from '@/hooks/swr/useUserInfo'
import { toast } from 'sonner'

const createProjectFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})

interface ConfigurationProps {
  setStep: (step: number) => void
  selectedPlatformId: number | null
  setCreatedProject: any
}

const Configuration: React.FC<ConfigurationProps> = ({
  setStep,
  selectedPlatformId,
  setCreatedProject,
}) => {
  const { projectPlatforms, isLoading, error } = useProjectPlatforms()
  const { user } = useUserInfo()

  const form = useForm<z.infer<typeof createProjectFormSchema>>({
    resolver: zodResolver(createProjectFormSchema),
  })

  const [isCreating, setIsCreating] = useState(false)

  if (isLoading) return <Skeleton className="w-full h-full" />
  if (error) return <div>Error: {error.message}</div>

  const handleSubmit = async (values: z.infer<typeof createProjectFormSchema>) => {
    setIsCreating(true)

    const response = await postFetcher('/project', {
      body: {
        ...values,
        team_id: user?.team_id,
        platform_id: selectedPlatformId,
      },
    })
    if (response.code !== 200) {
      toast.error(response.message)
    } else {
      setCreatedProject(response.data)
      setStep(3)
    }
    setIsCreating(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">配置项目</h1>
        <p className="text-muted-foreground">设置项目基本信息和监控选项</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>项目信息</CardTitle>
          <CardDescription>
            为您的 {projectPlatforms.find((platform) => platform.id === selectedPlatformId)?.name}{' '}
            项目设置基本信息
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor="name">项目名称 *</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="例如：我的前端应用" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel htmlFor="description">项目描述</FormLabel>
                    <FormControl>
                      <Textarea id="description" placeholder="简要描述您的项目..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  上一步
                </Button>
                <Button
                  type="submit"
                  disabled={!form.formState.isValid || isCreating}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isCreating ? '创建中...' : '创建项目'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Configuration
