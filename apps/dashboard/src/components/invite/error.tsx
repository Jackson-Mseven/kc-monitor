import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Error = () => {
  return (
    <div className="text-center py-12">
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-6">
        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">
        Something Went Wrong
      </h2>
      <p className="text-muted-foreground mb-6">
        We encountered an error while processing your invitation. Please try again or contact
        support.
      </p>
      <div className="flex gap-2 justify-center">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
        <Button asChild>
          <Link href="/support">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}

export default Error
