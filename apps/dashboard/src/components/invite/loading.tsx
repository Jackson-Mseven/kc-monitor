import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className="text-center py-12">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
      <h2 className="text-xl font-semibold mb-2">Validating Invitation</h2>
      <p className="text-muted-foreground">Please wait while we verify your invitation...</p>
    </div>
  )
}

export default Loading
