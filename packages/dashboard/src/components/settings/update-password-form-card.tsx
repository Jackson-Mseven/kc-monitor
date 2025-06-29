'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PasswordSchema, UserUpdatePasswordSchema } from '@kc-monitor/shared'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { putFetcher } from '@/utils/fetcher'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const FormSchema = UserUpdatePasswordSchema.extend({
  confirmPassword: PasswordSchema,
}).refine((data) => data.confirmPassword === data.newPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

const UpdatePasswordFormCard = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    putFetcher(`/user/update-password`, {
      credentials: 'include',
      body: {
        password: data.password,
        newPassword: data.newPassword,
      },
    }).then((res) => {
      if (res.code === 200) {
        toast.success('Password updated successfully')
        resetForm()
        router.push('/login')
      } else {
        toast.error(res.message)
      }
    })
  }

  const resetForm = () => {
    form.reset()
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
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage your account security</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="password">Current Password</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
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
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="newPassword">New Password</FormLabel>
                  <FormControl>
                    <Input
                      id="newPassword"
                      type="password"
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      id="confirmPassword"
                      type="password"
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

export default UpdatePasswordFormCard
