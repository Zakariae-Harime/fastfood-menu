'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { formatPrice, lineSubtotal, type CartLine } from '@/lib/types'

interface CartLineItemProps {
  line: CartLine
  onQuantityChange: (uid: string, quantity: number) => void
  onRemove: (uid: string) => void
}

export function CartLineItem({ line, onQuantityChange, onRemove }: CartLineItemProps) {
  const { t, itemName, ingredientName } = useLanguage()
  const removed = line.ingredients.filter((choice) => choice.quantity === 0)
  const added = line.ingredients.filter((choice) => choice.quantity > 1)
  const name = itemName(line.item)

  return (
    <li className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold leading-snug text-card-foreground">{name}</p>
          <div className="mt-1 space-y-0.5 text-sm leading-snug text-muted-foreground">
            {line.bread ? <p>{t('cart.bread')}: {ingredientName(line.bread)}</p> : null}
            {removed.length ? <p>{t('cart.without')}: {removed.map((choice) => ingredientName(choice.ingredient)).join(', ')}</p> : null}
            {added.length ? <p>{t('cart.extra')}: {added.map((choice) => `${ingredientName(choice.ingredient)} ×${choice.quantity}`).join(', ')}</p> : null}
            {line.extras.length ? <p>{line.extras.map(ingredientName).join(', ')}</p> : null}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(line.uid)}
          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label={t('cart.remove', { name })}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="flex items-center rounded-full bg-muted" dir="ltr">
          <button
            type="button"
            onClick={() => onQuantityChange(line.uid, line.quantity - 1)}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={t('customize.decreaseQuantity')}
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <span className="w-7 text-center font-bold" aria-live="polite">{line.quantity}</span>
          <button
            type="button"
            onClick={() => onQuantityChange(line.uid, line.quantity + 1)}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={t('customize.increaseQuantity')}
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </div>
        <span className="font-display font-bold text-card-foreground" dir="ltr">{formatPrice(lineSubtotal(line))}</span>
      </div>
    </li>
  )
}
