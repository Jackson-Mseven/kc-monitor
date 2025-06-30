'use client'

import React from 'react'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeInput, Input, PasswordInput } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
import { CODE_TYPE, pick, RegisterFormSchema } from '@kc-monitor/shared'
import { useRouter } from 'next/navigation'

const RegisterPage = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
  })

  const handleSubmit = async (values: z.infer<typeof RegisterFormSchema>) => {
    const response = await postFetcher('/auth/register', {
      body: pick(values, ['name', 'email', 'password', 'code']),
    })
    if (response.code === 201) {
      toast.success('Registration is successful')
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
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="name">Username</FormLabel>
                  <FormControl>
                    <Input id="name" placeholder="Kincy" required className="h-11" {...field} />
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
                    <CodeInput
                      id="code"
                      placeholder="Enter verification code"
                      required
                      className="h-11 flex-1"
                      {...field}
                      buttonProps={{
                        className: 'h-11 px-4',
                        onClick: async () => {
                          const email = form.getValues('email')
                          if (!email) {
                            form.setError('email', { message: '邮箱不能为空' })
                            return
                          }

                          const response = await postFetcher('/auth/send-code', {
                            body: { email, type: CODE_TYPE.REGISTER },
                          })
                          if (response.code === 200) {
                            toast.success('验证码发送成功')
                          } else {
                            toast.error(response.message)
                          }
                        },
                      }}
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
                  <FormControl>
                    <PasswordInput
                      id="password"
                      placeholder="Create a password"
                      required
                      className="h-11 pr-10"
                      {...field}
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
                  <FormLabel htmlFor="confirmPassword">Confirm password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      id="confirmPassword"
                      placeholder="Confirm your password"
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
              Create account
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

export default RegisterPage
