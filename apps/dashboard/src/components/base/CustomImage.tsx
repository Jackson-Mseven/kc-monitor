'use client'

import Image, { ImageProps } from 'next/image'
import React, { forwardRef } from 'react'

const CustomImage = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  return <Image ref={ref} {...props} />
})

CustomImage.displayName = 'CustomImage'

export default CustomImage
