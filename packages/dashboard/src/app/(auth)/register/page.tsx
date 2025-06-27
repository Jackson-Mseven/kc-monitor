'use client'

import React, { useState } from 'react'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import CustomLink from '@/components/base/CustomLink'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { postFetcher } from '@/utils/fetcher'
import { pick, RegisterFormSchema } from '@kc-monitor/shared'
import { useRouter } from 'next/navigation'

const RegisterPage = () => {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
  })

  const handleSubmit = async (values: z.infer<typeof RegisterFormSchema>) => {
    const response = await postFetcher('/auth/register', {
      body: pick(values, ['username', 'email', 'password', 'code']),
    })
    if (response.code === 200) {
      toast.success('注册成功')
      router.push('/login')
    } else {
      toast.error(response.message)
    }
  }

  return (
    <>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
        <CardDescription>Get started with your free account today</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <FormControl>
                    <Input id="username" placeholder="Kincy" required className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="code"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="code">Verification Code</FormLabel>
                  <FormControl>
                    <div className="flex space-x-2">
                      <Input
                        id="code"
                        placeholder="Enter verification code"
                        required
                        className="h-11 flex-1"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 px-4"
                        onClick={async () => {
                          const email = form.getValues('email')
                          if (!email) {
                            form.setError('email', { message: '邮箱不能为空' })
                            return
                          }

                          const response = await postFetcher('/auth/send-code', {
                            body: { email },
                          })
                          if (response.code === 200) {
                            toast.success('验证码发送成功')
                          } else {
                            toast.error(response.message)
                          }
                        }}
                      >
                        Send Code
                      </Button>
                    </div>
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
                    <>
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        required
                        className="h-11 pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </>
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
                  <FormLabel htmlFor="confirmPassword">Confirm password</FormLabel>
                  <FormControl className="relative">
                    <>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        required
                        className="h-11 pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-11 bg-purple-600 hover:bg-purple-700">
              Create account
            </Button>
          </form>
        </Form>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{' '}
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

export default RegisterPage
