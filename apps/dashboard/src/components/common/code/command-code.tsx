import { Copy, Terminal } from 'lucide-react'
import React from 'react'
import { Button } from '../../ui/button'
import copyToClipboard from '@/utils/copyToClipboard'

interface CommandCodeProps {
  code: string
}

const CommandCode: React.FC<CommandCodeProps> = ({ code }) => {
  return (
    <div className="flex items-center gap-2 bg-muted p-3 rounded">
      <Terminal className="w-4 h-4" />
      <code className="text-sm flex-1">{code}</code>
      <Button
        size="sm"
        variant="ghost"
        className="hover:bg-white"
        onClick={() => copyToClipboard(code)}
      >
        <Copy className="w-3 h-3" />
      </Button>
    </div>
  )
}

export default CommandCode
