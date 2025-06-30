'use client'

import React, { useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TeamUpdateSchema } from '@kc-monitor/shared'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { putFetcher } from '@/utils/fetcher'
import withTeamPermission from '@/hoc/withTeamPermission'
import useUserInfo from '@/hooks/swr/useUserInfo'

const AuthInput = withTeamPermission(Input, 'team:update')
const AuthButton = withTeamPermission(Button, 'team:update')

export default function UpdateTeamFormCard() {
  const router = useRouter()

  const { user, isLoading, error } = useUserInfo()

  const form = useForm<z.infer<typeof TeamUpdateSchema>>({
    resolver: zodResolver(TeamUpdateSchema),
    defaultValues: user?.teams,
  })

  const resetForm = useCallback(() => {
    form.reset(user?.teams)
  }, [form, user?.teams])

  useEffect(() => {
    resetForm()
  }, [resetForm])

  if (isLoading) return <Skeleton className="h-10 w-full" />
  if (error) {
    toast.error('Failed to fetch user info, please login again')
    router.push('/login')
  }

  const handleSubmit = (data: z.infer<typeof TeamUpdateSchema>) => {
    putFetcher(`/team/${user?.teams?.id}`, {
      body: data,
    }).then((res) => {
      if (res.code !== 200) {
        toast.error(res.message)
        return
      }
      toast.success('Team updated')
      router.refresh()
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      form.handleSubmit(handleSubmit)()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Information</CardTitle>
        <CardDescription>Manage your team settings and information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="name">Team Name</FormLabel>
                  <FormControl>
                    <AuthInput id="name" {...field} onKeyDown={handleKeyDown} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="slug">Team Slug</FormLabel>
                  <FormControl>
                    <AuthInput id="slug" {...field} onKeyDown={handleKeyDown} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <AuthButton type="button" variant="outline" onClick={resetForm}>
                Reset
              </AuthButton>
              <AuthButton type="submit">Save Changes</AuthButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
