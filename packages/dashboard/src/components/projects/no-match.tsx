import React from 'react'
import { Card } from '../ui/card'
import { Search } from 'lucide-react'

const NoMatch = () => {
  return (
    <Card className="flex flex-1 items-center justify-center p-8">
      <div className="text-center">
        <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">未找到匹配的项目</h3>
        <p className="text-muted-foreground">尝试调整搜索条件或筛选器</p>
      </div>
    </Card>
  )
}

export default NoMatch
