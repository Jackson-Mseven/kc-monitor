import { Search } from 'lucide-react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ProjectsFilterSchema } from '@kc-monitor/shared'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import useProjectPlatforms from '@/hooks/swr/useProjectPlatforms'
import { Skeleton } from '../ui/skeleton'
import ProjectsCard from './projects-card'
import ProjectsTable from './projects-table'
import { Filters } from '@/hooks/swr/useTeamProjects'

export const VIEW_MODES = [
  {
    name: '网格',
    Component: ProjectsCard,
  },
  {
    name: '表格',
    Component: ProjectsTable,
  },
].map((item, index) => ({
  ...item,
  id: String(index),
}))

export type ViewModeId = (typeof VIEW_MODES)[number]['id']

interface ProjectsFilterProps {
  viewMode: ViewModeId
  setViewMode: React.Dispatch<React.SetStateAction<ViewModeId>>
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
}

const DEFAULT_PLATFORM = {
  id: -1,
  name: '所有平台',
}

const Filter: React.FC<ProjectsFilterProps> = ({ viewMode, setViewMode, setFilters }) => {
  const { projectPlatforms, isLoading } = useProjectPlatforms()

  const form = useForm<z.infer<typeof ProjectsFilterSchema>>({
    resolver: zodResolver(ProjectsFilterSchema),
    defaultValues: {
      platform_id: String(DEFAULT_PLATFORM.id),
    },
  })

  const handleSubmit = (data: z.infer<typeof ProjectsFilterSchema>) => {
    const { platform_id, search } = data
    if (platform_id === String(DEFAULT_PLATFORM.id)) {
      setFilters({ search })
    } else {
      setFilters(data)
    }
  }

  if (isLoading) return <Skeleton className="w-full h-9" />

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex flex-1 gap-4 max-w-lg">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="搜索项目名称、描述、Slug"
                        className="pl-10"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            form.handleSubmit(handleSubmit)
                          }
                        }}
                      />
                    </div>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="platform_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => {
                        field.onChange(value)
                        handleSubmit({
                          search: form.getValues('search'),
                          platform_id: value,
                        })
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[DEFAULT_PLATFORM, ...projectPlatforms]?.map((item) => {
                          return (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.name}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <Select value={viewMode} onValueChange={(value: ViewModeId) => setViewMode(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VIEW_MODES.map((mode) => {
                  return (
                    <SelectItem key={mode.id} value={mode.id}>
                      {mode.name}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default Filter
