import React from 'react'
import { Button } from '../../ui/button'
import { Copy } from 'lucide-react'
import copyToClipboard from '@/utils/copyToClipboard'

interface PreCodeProps {
  code: string
}

const PreCode: React.FC<PreCodeProps> = ({ code }) => {
  return (
    <div className="bg-muted p-3 rounded relative">
      <pre className="text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="ghost"
        className="bg-muted hover:bg-white absolute top-3 right-3"
        onClick={() => copyToClipboard(code)}
      >
        <Copy className="w-3 h-3" />
      </Button>
    </div>
  )
}

export default PreCode
