'use client'

import React from 'react'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input, PasswordInput } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import CustomLink from '@/components/base/CustomLink'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LoginSchema } from '@kc-monitor/shared'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { postFetcher } from '@/utils/fetcher'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const LoginPage = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  })

  const handleSubmit = async (values: z.infer<typeof LoginSchema>) => {
    const response = await postFetcher('/auth/login', {
      credentials: 'include',
      body: values,
    })
    if (response.code !== 200 && !response.data) {
      toast.error(response.message)
      return
    }
    toast.success(response.message)
    router.push('/dashboard')
  }

  return (
    <>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="email">Email address</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl className="relative">
                    <PasswordInput
                      id="password"
                      placeholder="Enter your password"
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
              Sign in
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button variant="outline" className="w-full h-11">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>

        <div className="text-center space-y-2">
          <CustomLink
            href="/forgot-password"
            className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
          >
            Forgot your password?
          </CustomLink>
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?
            <CustomLink
              href="/register"
              className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
            >
              Sign up
            </CustomLink>
          </div>
        </div>
      </CardContent>
    </>
  )
}

export default LoginPage
