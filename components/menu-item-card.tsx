'use client'

import { Plus, SlidersHorizontal } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import type { MenuItem } from '@/lib/types'
import { formatPrice } from '@/lib/types'

interface MenuItemCardProps {
  item: MenuItem
  onCustomize: (item: MenuItem) => void
}

export function MenuItemCard({ item, onCustomize }: MenuItemCardProps) {
  const { t, itemName, ingredientName } = useLanguage()
  const isCustomizable = item.bread_options.length > 0 || item.extras.length > 0 || item.included.length > 0
  const name = itemName(item)
  const description = item.included.map(ingredientName).join(' · ')

  return (
    <article className="group flex h-full min-h-40 overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="w-3 shrink-0 bg-primary" aria-hidden="true" />
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-3 sm:gap-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 font-display text-base font-bold leading-tight text-card-foreground text-balance sm:text-lg">{name}</h3>
          <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 font-display text-sm font-black tabular-nums text-accent-foreground sm:px-3 sm:py-1.5" dir="ltr">
            {formatPrice(item.base_price)}
          </span>
        </div>
        {description ? <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{description}</p> : null}
        <button
          type="button"
          onClick={() => onCustomize(item)}
          className="mt-auto inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 self-stretch rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {isCustomizable ? <SlidersHorizontal className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
          {t(isCustomizable ? 'menu.customize' : 'menu.add')}
        </button>
      </div>
    </article>
  )
}
