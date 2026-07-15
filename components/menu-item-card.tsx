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
    <article className="group flex h-full min-h-40 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md min-[400px]:flex-row">
      {item.image ? (
        <img
          src={item.image}
          alt={name}
          width={320}
          height={320}
          className="h-32 w-full shrink-0 object-cover min-[400px]:h-auto min-[400px]:w-32 sm:w-36"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="flex h-2 shrink-0 bg-primary min-[400px]:h-auto min-[400px]:w-3" aria-hidden="true" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 font-display text-lg font-bold leading-tight text-card-foreground text-balance">{name}</h3>
          <span className="shrink-0 rounded-full bg-accent px-3 py-1.5 font-display text-sm font-bold tabular-nums text-accent-foreground" dir="ltr">
            {formatPrice(item.base_price)}
          </span>
        </div>
        {description ? <p className="text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
        <button
          type="button"
          onClick={() => onCustomize(item)}
          className="mt-auto inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 self-stretch rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {isCustomizable ? <SlidersHorizontal className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
          {t(isCustomizable ? 'menu.customize' : 'menu.add')}
        </button>
      </div>
    </article>
  )
}
