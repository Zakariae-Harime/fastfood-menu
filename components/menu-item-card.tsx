'use client'

import { Plus } from 'lucide-react'
import type { MenuItem } from '@/lib/types'
import { formatPrice } from '@/lib/types'

interface MenuItemCardProps {
  item: MenuItem
  onCustomize: (item: MenuItem) => void
}

export function MenuItemCard({ item, onCustomize }: MenuItemCardProps) {
  const isCustomizable = item.bread_options.length > 0 || item.extras.length > 0

  return (
    <article className="overflow-hidden rounded-3xl bg-card shadow-sm">
      {item.image && (
        <img
          src={item.image}
          alt={item.name_fr}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
      )}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold leading-tight text-card-foreground text-balance">
              {item.name_fr}
            </h3>
            <p className="text-sm text-muted-foreground" dir="rtl" lang="ar">
              {item.name_darija}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-accent px-3 py-1.5 font-display text-base font-bold text-accent-foreground">
            {formatPrice(item.base_price)}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.included.map((i) => i.name).join(' · ')}
        </p>

        <button
          type="button"
          onClick={() => onCustomize(item)}
          className="mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground transition-transform active:scale-95"
        >
          <Plus className="size-5" aria-hidden="true" />
          {isCustomizable ? 'Personnaliser' : 'Ajouter'}
        </button>
      </div>
    </article>
  )
}
