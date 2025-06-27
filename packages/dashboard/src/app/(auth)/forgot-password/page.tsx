'use client'

import React from 'react'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import CustomLink from '@/components/base/CustomLink'
import { Form, FormField } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ForgetPasswordSchema } from '@kc-monitor/shared'
import { toast } from 'sonner'
import { postFetcher } from '@/utils/fetcher'

const ForgotPasswordForm = () => {
  const form = useForm<z.infer<typeof ForgetPasswordSchema>>({
    resolver: zodResolver(ForgetPasswordSchema),
  })

  const handleSubmit = async (values: z.infer<typeof ForgetPasswordSchema>) => {
    const response = await postFetcher('/auth/forgot-password', {
      body: values,
    })
    if (response.code === 200) {
      toast.success('密码重置邮件已发送')
    } else {
      toast.error(response.message)
    }
  }

  return (
    <>
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <CustomLink href="/login">
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </CustomLink>
          <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
        </div>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="you@example.com"
                    required
                    className="h-11"
                    type="email"
                  />
                )}
              />
            </div>
            <Button type="submit" className="w-full h-11 bg-purple-600 hover:bg-purple-700">
              Send reset link
            </Button>
          </form>
        </Form>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            Remember your password?{' '}
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

export default ForgotPasswordForm
