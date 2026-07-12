'use client'

import { useEffect, useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import type { Ingredient, IngredientChoice, MenuExtra, MenuItem } from '@/lib/types'
import { formatPrice } from '@/lib/types'

interface CustomizeSheetProps {
  item: MenuItem | null
  onClose: () => void
}

export function CustomizeSheet({ item, onClose }: CustomizeSheetProps) {
  const { addLine } = useCart()
  const [bread, setBread] = useState<Ingredient | null>(null)
  const [selectedExtras, setSelectedExtras] = useState<MenuExtra[]>([])
  // Chosen quantity per included ingredient, keyed by name. Default is 1.
  const [ingredientQty, setIngredientQty] = useState<Record<string, number>>({})
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (item) {
      setBread(item.bread_options[0] ?? null)
      setSelectedExtras([])
      setIngredientQty(Object.fromEntries(item.included.map((i) => [i.name, 1])))
      setQuantity(1)
    }
  }, [item])

  if (!item) return null

  // Included ingredients are only adjustable on composed items (sandwiches).
  // Drinks/sides list a single descriptive line, not controllable ingredients.
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

  const setIngredient = (name: string, next: number) => {
    setIngredientQty((prev) => ({ ...prev, [name]: Math.max(0, Math.min(5, next)) }))
  }

  const handleAdd = () => {
    // Only send ingredients whose quantity differs from the default of 1.
    const ingredients: IngredientChoice[] = item.included
      .map((ingredient) => ({ ingredient, quantity: ingredientQty[ingredient.name] ?? 1 }))
      .filter((choice) => choice.quantity !== 1)
    addLine(item, bread, selectedExtras, ingredients, quantity)
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

          {/* Included ingredients — adjust quantity, 0 to remove */}
          {showIngredients && (
            <fieldset className="mb-6">
              <legend className="mb-1 font-display text-base font-bold text-card-foreground">
                Ingrédients
              </legend>
              <p className="mb-3 text-sm text-muted-foreground">
                Ajoutez, réduisez ou retirez (0) ce que vous voulez.
              </p>
              <div className="flex flex-col gap-2">
                {item.included.map((ingredient) => {
                  const qty = ingredientQty[ingredient.name] ?? 1
                  const removed = qty === 0
                  return (
                    <div
                      key={ingredient.name}
                      className={`flex min-h-12 items-center justify-between gap-3 rounded-2xl border-2 px-4 transition-colors ${
                        removed ? 'border-border bg-card opacity-60' : 'border-primary bg-accent'
                      }`}
                    >
                      <span className="flex min-w-0 flex-col">
                        <span
                          className={`font-medium text-card-foreground ${removed ? 'line-through' : ''}`}
                        >
                          {ingredient.name}
                          {qty > 1 && <span className="ml-1 font-bold">×{qty}</span>}
                        </span>
                        <span className="text-xs text-muted-foreground" dir="rtl" lang="ar">
                          {ingredient.name_darija}
                        </span>
                      </span>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIngredient(ingredient.name, qty - 1)}
                          className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground disabled:opacity-40"
                          disabled={qty <= 0}
                          aria-label={`Réduire ${ingredient.name}`}
                        >
                          <Minus className="size-4" aria-hidden="true" />
                        </button>
                        <span className="w-5 text-center font-bold" aria-live="polite">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIngredient(ingredient.name, qty + 1)}
                          className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground disabled:opacity-40"
                          disabled={qty >= 5}
                          aria-label={`Ajouter ${ingredient.name}`}
                        >
                          <Plus className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
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
