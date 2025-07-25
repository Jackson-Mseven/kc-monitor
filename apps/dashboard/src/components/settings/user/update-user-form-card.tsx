'use client'

import React, { useCallback, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { putFetcher } from '@/utils/fetcher'
import { UserSchema } from '@kc-monitor/shared'
import { useRouter } from 'next/navigation'
import useUserInfo from '@/hooks/swr/useUserInfo'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

const FormSchema = UserSchema.pick({
  name: true,
})

const UpdateUserFormCard = () => {
  const router = useRouter()
  const { user, isLoading, error } = useUserInfo()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user?.name || '',
    },
  })

  const resetForm = useCallback(() => {
    form.reset(user)
  }, [form, user])

  useEffect(() => {
    resetForm()
  }, [resetForm])

  if (isLoading) return <Skeleton className="h-10 w-full" />
  if (error) {
    toast.error('Failed to fetch user info, please login again')
    router.push('/login')
  }

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    putFetcher(`/user/${user?.id}`, {
      body: data,
    }).then((res) => {
      if (res.code !== 200) {
        toast.error(res.message)
        return
      }
      toast.success('User info updated')
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
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal information and profile settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            {/* <AvatarImage src={user?.avatar} alt="Profile" /> */}
            <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline">Change Avatar</Button>
            <p className="text-sm text-muted-foreground mt-2">JPG, GIF or PNG. 1MB max.</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="id">ID</Label>
          <Input id="id" defaultValue={user?.id || ''} disabled />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="name">Username</FormLabel>
                  <FormControl defaultValue={user?.name}>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Kincy"
                      required
                      className="h-11"
                      {...field}
                      onKeyDown={handleKeyDown}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default UpdateUserFormCard
