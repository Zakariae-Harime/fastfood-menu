'use client'

import { useState } from 'react'
import type { MenuCategory } from '@/lib/types'

interface CategoryBannerProps {
  category: MenuCategory
}

export function CategoryBanner({ category }: CategoryBannerProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading')

  if (status === 'failed') return null

  return (
    <img
      src={`/images/categories/${category}.jpg`}
      alt=""
      onLoad={() => setStatus('loaded')}
      onError={() => setStatus('failed')}
      className={`${status === 'loaded' ? 'block' : 'hidden'} mb-4 h-32 w-full rounded-2xl object-cover sm:h-40`}
    />
  )
}
