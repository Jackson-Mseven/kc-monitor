'use client'

import Link from 'next/link'
import React, { PropsWithChildren } from 'react'

const CustomLink = React.forwardRef<
  HTMLAnchorElement,
  PropsWithChildren<React.ComponentProps<typeof Link>>
>(({ children, ...props }, ref) => {
  return (
    <Link ref={ref} {...props}>
      {children}
    </Link>
  )
})

CustomLink.displayName = 'CustomLink'

export default CustomLink
