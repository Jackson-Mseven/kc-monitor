'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Loader2, Users } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TeamSchema } from '@kc-monitor/shared'
import { postFetcher } from '@/utils/fetcher'
import { toast } from 'sonner'

export default function CreateTeamDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof TeamSchema>>({
    resolver: zodResolver(TeamSchema),
  })

  const handleSubmit = async (data: z.infer<typeof TeamSchema>) => {
    setIsLoading(true)
    const response = await postFetcher('/user/me/team', {
      body: data,
    })
    if (response.code === 201) {
      setOpen(false)
      toast.success('Team created successfully')
      window.location.reload()
    } else {
      toast.error(response.message)
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Create Team
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Create New Team
          </DialogTitle>
          <DialogDescription>
            Create a new team to start collaborating with your colleagues. You can always invite
            members later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="name">Team Name *</FormLabel>
                  <FormControl>
                    <Input id="name" placeholder="kc-team" required className="h-11" {...field} />
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
                  <FormLabel htmlFor="slug">Team Slug *</FormLabel>
                  <FormControl>
                    <Input id="slug" placeholder="kc-team" required className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Team'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
