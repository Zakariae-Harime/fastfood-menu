'use client'

import { useState } from 'react'
import type { MenuCategory } from '@/lib/types'

interface CategoryBannerProps {
  category: MenuCategory
}

const categoryImageOverrides: Partial<Record<MenuCategory, string>> = {
  Pizza: '/images/categories/Pizza.png',
  Panini: '/images/categories/Panini.png',
  Shawarma: '/images/categories/Shawarma.png',
  Foure: '/images/categories/Foure.png',
  Hamburgers: '/images/categories/Burger.png',
  PlatsSpeciaux: '/images/categories/PlatSpecial.png',
  SandwichsFrais: 'https://i.pinimg.com/originals/eb/be/11/ebbe112c09ddd5379900887a40df1ba8.jpg',
  SandwichsChauds: '/images/categories/SandwichsChauds.png',
  Tagine: 'https://i.pinimg.com/originals/5d/05/3d/5d053d0928743bad264604bbfb4d721c.jpg',
  Pasticcio: 'https://i.pinimg.com/originals/26/e8/34/26e834b12d594e39ba1ad7142f61970a.jpg',
  Tacos: 'https://images.unsplash.com/photo-1613319300745-88bc37cceccf?ixlib=rb-4.1.0&q=90&fm=jpg&crop=entropy&cs=srgb&w=1800',
}

export function CategoryBanner({ category }: CategoryBannerProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading')
  const source = categoryImageOverrides[category] ?? `/images/categories/${category}.jpg`

  if (status === 'failed') return null

  return (
    <img
      src={source}
      alt=""
      onLoad={() => setStatus('loaded')}
      onError={() => setStatus('failed')}
      className={`${status === 'loaded' ? 'block' : 'hidden'} mb-4 h-32 w-full rounded-2xl object-cover sm:h-40`}
    />
  )
}
