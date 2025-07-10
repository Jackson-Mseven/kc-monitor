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

interface ProjectsFilterProps {
  viewMode: 'grid' | 'table'
  setViewMode: (value: 'grid' | 'table') => void
}

const ProjectsFilter: React.FC<ProjectsFilterProps> = ({ viewMode, setViewMode }) => {
  const form = useForm<z.infer<typeof ProjectsFilterSchema>>({
    resolver: zodResolver(ProjectsFilterSchema),
    defaultValues: {
      search: '',
      platform: 'all',
    },
  })

  const handleSubmit = (data: z.infer<typeof ProjectsFilterSchema>) => {
    console.log(data)
  }

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
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => {
                        field.onChange(value)
                        handleSubmit({
                          search: form.getValues('search'),
                          platform: value,
                        })
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有平台</SelectItem>
                        <SelectItem value="react">React</SelectItem>
                        <SelectItem value="nextjs">Next.js</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <Select
              value={viewMode}
              onValueChange={(value: 'grid' | 'table') => setViewMode(value)}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">网格</SelectItem>
                <SelectItem value="table">表格</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default ProjectsFilter
