'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CardContent, CardHeader } from '@/components/ui/card'
import CustomLink from '@/components/base/CustomLink'
import { Button } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import { CardDescription } from '@/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { FormLabel } from '@/components/ui/form'
import { FormControl } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ResetPasswordSchema } from '@kc-monitor/shared'
import { toast } from 'sonner'
import { postFetcher } from '@/utils/fetcher'
import { PasswordInput } from '@/components/ui/input'

const ResetPasswordFormSchema = ResetPasswordSchema.pick({
  newPassword: true,
})

export default function ResetPassword() {
  const token = useSearchParams().get('token')
  const router = useRouter()

  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
  })

  const handleSubmit = async (values: z.infer<typeof ResetPasswordFormSchema>) => {
    const response = await postFetcher('/auth/reset-password', {
      body: { token, ...values },
    })
    if (response.code === 200) {
      toast.success('Password reset successfully')
      router.push('/login')
    } else {
      toast.error(response.message)
    }
  }

  return (
    <>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
        <CardDescription>Enter your new password</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="newPassword">New password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      id="newPassword"
                      placeholder="New password"
                      required
                      className="h-11 pr-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-11 bg-purple-600 hover:bg-purple-700">
              Reset password
            </Button>
          </form>
        </Form>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?
            <CustomLink
              href="/login"
              className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
            >
              Sign in
            </CustomLink>
          </div>
        </div>
      </CardContent>
    </>
  )
}
