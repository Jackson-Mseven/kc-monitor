'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Filter, RefreshCw, Search } from 'lucide-react'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FilterSchema, TEAM_JOIN_REQUEST_STATUS_TEXT } from '@kc-monitor/shared'

const DEFAULT_FILTER_VALUES = {
  search: '',
  status: -1,
}

const FilterCard = () => {
  const form = useForm<z.infer<typeof FilterSchema>>({
    resolver: zodResolver(FilterSchema),
    defaultValues: DEFAULT_FILTER_VALUES,
  })

  const handleRefresh = () => {
    form.reset(DEFAULT_FILTER_VALUES)
  }

  const handleSubmit = (data: z.infer<typeof FilterSchema>) => {
    console.log(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter & Search Applications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col md:flex-row gap-4"
          >
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="space-y-2 flex-1">
                  <FormControl>
                    <Input
                      id="search"
                      type="search"
                      placeholder="Search by name or email."
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => {
                        field.onChange(Number(value))
                      }}
                    >
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[['-1', 'All'], ...Object.entries(TEAM_JOIN_REQUEST_STATUS_TEXT)].map(
                          ([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default FilterCard
