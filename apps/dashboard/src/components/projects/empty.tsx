import { FolderOpen, Plus } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const Empty = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">还没有项目</h3>
        <p className="text-muted-foreground mb-4">创建您的第一个项目</p>
        <Button asChild>
          <Link href="/insights/projects/new">
            <Plus className="w-4 h-4 mr-2" />
            创建项目
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default Empty
