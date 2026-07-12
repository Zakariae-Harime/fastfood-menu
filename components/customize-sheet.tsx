'use client'

import { useEffect, useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import type { Ingredient, MenuExtra, MenuItem } from '@/lib/types'
import { formatPrice } from '@/lib/types'

interface CustomizeSheetProps {
  item: MenuItem | null
  onClose: () => void
}

export function CustomizeSheet({ item, onClose }: CustomizeSheetProps) {
  const { addLine } = useCart()
  const [bread, setBread] = useState<Ingredient | null>(null)
  const [selectedExtras, setSelectedExtras] = useState<MenuExtra[]>([])
  const [removed, setRemoved] = useState<Ingredient[]>([])
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (item) {
      setBread(item.bread_options[0] ?? null)
      setSelectedExtras([])
      setRemoved([])
      setQuantity(1)
    }
  }, [item])

  if (!item) return null

  // Included ingredients are only individually removable on composed items
  // (sandwiches). Drinks/sides list a single descriptive line, not toggles.
  const showIngredients = item.bread_options.length > 0 && item.included.length > 0

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0)
  const subtotal = (item.base_price + extrasTotal) * quantity

  const toggleExtra = (extra: MenuExtra) => {
    setSelectedExtras((prev) =>
      prev.some((e) => e.name === extra.name)
        ? prev.filter((e) => e.name !== extra.name)
        : [...prev, extra],
    )
  }

  const toggleIngredient = (ingredient: Ingredient) => {
    setRemoved((prev) =>
      prev.some((i) => i.name === ingredient.name)
        ? prev.filter((i) => i.name !== ingredient.name)
        : [...prev, ingredient],
    )
  }

  const handleAdd = () => {
    addLine(item, bread, selectedExtras, removed, quantity)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`Personnaliser ${item.name_fr}`}>
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Fermer"
      />

      {/* Bottom sheet */}
      <div className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-3xl bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold text-card-foreground">{item.name_fr}</h2>
            <p className="text-sm text-muted-foreground" dir="rtl" lang="ar">
              {item.name_darija}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
            aria-label="Fermer"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Bread options */}
          {item.bread_options.length > 0 && (
            <fieldset className="mb-6">
              <legend className="mb-3 font-display text-base font-bold text-card-foreground">
                Choix du pain
              </legend>
              <div className="flex flex-col gap-2">
                {item.bread_options.map((option) => (
                  <label
                    key={option.name}
                    className={`flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 px-4 transition-colors ${
                      bread?.name === option.name ? 'border-primary bg-accent' : 'border-border bg-card'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="bread"
                        value={option.name}
                        checked={bread?.name === option.name}
                        onChange={() => setBread(option)}
                        className="size-5 accent-[var(--primary)]"
                      />
                      <span className="font-medium text-card-foreground">{option.name}</span>
                    </span>
                    <span className="text-sm text-muted-foreground" dir="rtl" lang="ar">
                      {option.name_darija}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {/* Included ingredients — toggle off to remove */}
          {showIngredients && (
            <fieldset className="mb-6">
              <legend className="mb-1 font-display text-base font-bold text-card-foreground">
                Ingrédients
              </legend>
              <p className="mb-3 text-sm text-muted-foreground">
                Décochez ce que vous ne voulez pas.
              </p>
              <div className="flex flex-col gap-2">
                {item.included.map((ingredient) => {
                  const kept = !removed.some((i) => i.name === ingredient.name)
                  return (
                    <label
                      key={ingredient.name}
                      className={`flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 px-4 transition-colors ${
                        kept ? 'border-primary bg-accent' : 'border-border bg-card opacity-60'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={kept}
                          onChange={() => toggleIngredient(ingredient)}
                          className="size-5 accent-[var(--primary)]"
                        />
                        <span
                          className={`font-medium text-card-foreground ${kept ? '' : 'line-through'}`}
                        >
                          {ingredient.name}
                        </span>
                      </span>
                      <span className="text-sm text-muted-foreground" dir="rtl" lang="ar">
                        {ingredient.name_darija}
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          )}

          {/* Extras */}
          {item.extras.length > 0 && (
            <fieldset className="mb-6">
              <legend className="mb-3 font-display text-base font-bold text-card-foreground">
                Extras
              </legend>
              <div className="flex flex-col gap-2">
                {item.extras.map((extra) => {
                  const checked = selectedExtras.some((e) => e.name === extra.name)
                  return (
                    <label
                      key={extra.name}
                      className={`flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 px-4 transition-colors ${
                        checked ? 'border-primary bg-accent' : 'border-border bg-card'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleExtra(extra)}
                          className="size-5 accent-[var(--primary)]"
                        />
                        <span className="flex flex-col">
                          <span className="font-medium text-card-foreground">{extra.name}</span>
                          <span className="text-xs text-muted-foreground" dir="rtl" lang="ar">
                            {extra.name_darija}
                          </span>
                        </span>
                      </span>
                      <span className="text-sm font-semibold text-muted-foreground">
                        +{formatPrice(extra.price)}
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          )}

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <span className="font-display text-base font-bold text-card-foreground">Quantité</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex size-11 items-center justify-center rounded-full bg-muted text-foreground disabled:opacity-40"
                disabled={quantity <= 1}
                aria-label="Diminuer la quantité"
              >
                <Minus className="size-5" aria-hidden="true" />
              </button>
              <span className="w-8 text-center font-display text-xl font-bold" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex size-11 items-center justify-center rounded-full bg-muted text-foreground"
                aria-label="Augmenter la quantité"
              >
                <Plus className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer with subtotal */}
        <div className="border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={handleAdd}
            className="flex min-h-14 w-full items-center justify-between rounded-full bg-primary px-6 font-bold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            <span>Ajouter au panier</span>
            <span className="font-display text-lg" aria-live="polite">{formatPrice(subtotal)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
