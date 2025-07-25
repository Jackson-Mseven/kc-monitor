import { Button } from '@/components/ui/button'
import copyToClipboard from '@/utils/copyToClipboard'
import { Copy } from 'lucide-react'
import React from 'react'

interface LineCodeProps {
  code: string
}

const LineCode: React.FC<LineCodeProps> = ({ code }) => {
  return (
    <div className="flex items-center gap-2">
      <code className="text-sm bg-muted px-2 py-1 rounded flex-1 truncate">{code}</code>
      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(code)}>
        <Copy className="w-3 h-3" />
      </Button>
    </div>
  )
}

export default LineCode
