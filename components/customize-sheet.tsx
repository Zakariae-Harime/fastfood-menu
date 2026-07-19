'use client'

import { useEffect, useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useLanguage } from '@/lib/language-context'
import type { Ingredient, IngredientChoice, MenuExtra, MenuItem } from '@/lib/types'
import { formatPrice } from '@/lib/types'

interface CustomizeSheetProps {
  item: MenuItem | null
  onClose: () => void
  onOrder: () => void
}

export function CustomizeSheet({ item, onClose, onOrder }: CustomizeSheetProps) {
  const { addLine } = useCart()
  const { t, itemName, ingredientName } = useLanguage()
  const [bread, setBread] = useState<Ingredient | null>(null)
  const [selectedExtras, setSelectedExtras] = useState<MenuExtra[]>([])
  const [ingredientQty, setIngredientQty] = useState<Record<string, number>>({})
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (item) {
      setBread(item.bread_options[0] ?? null)
      setSelectedExtras([])
      setIngredientQty(Object.fromEntries(item.included.map((ingredient) => [ingredient.name, 1])))
      setQuantity(1)
    }
  }, [item])

  if (!item) return null
  const name = itemName(item)
  const showIngredients = item.bread_options.length > 0 && item.included.length > 0
  const subtotal = (item.base_price + selectedExtras.reduce((sum, extra) => sum + extra.price, 0)) * quantity
  const toggleExtra = (extra: MenuExtra) => setSelectedExtras((current) => current.some((entry) => entry.name === extra.name) ? current.filter((entry) => entry.name !== extra.name) : [...current, extra])
  const setIngredient = (ingredient: string, next: number) => setIngredientQty((current) => ({ ...current, [ingredient]: Math.max(0, Math.min(5, next)) }))
  const addCurrentItem = () => {
    const ingredients: IngredientChoice[] = item.included.map((ingredient) => ({ ingredient, quantity: ingredientQty[ingredient.name] ?? 1 })).filter((choice) => choice.quantity !== 1)
    return addLine(item, bread, selectedExtras, ingredients, quantity)
  }
  const handleAdd = () => {
    addCurrentItem()
    onClose()
  }
  const handleOrder = () => {
    addCurrentItem()
    onOrder()
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t('customize.label', { name })}>
      <button type="button" className="absolute inset-0 bg-black/50" onClick={onClose} aria-label={t('customize.close')} />
      <div className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-3xl bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-display text-xl font-bold text-card-foreground">{name}</h2>
          <button type="button" onClick={onClose} className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground" aria-label={t('customize.close')}><X className="size-5" aria-hidden="true" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {item.bread_options.length ? <fieldset className="mb-6"><legend className="mb-3 font-display text-base font-bold text-card-foreground">{t('customize.bread')}</legend><div className="flex flex-col gap-2">{item.bread_options.map((option) => <label key={option.name} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 transition-colors ${bread?.name === option.name ? 'border-primary bg-accent' : 'border-border bg-card'}`}><input type="radio" name="bread" value={option.name} checked={bread?.name === option.name} onChange={() => setBread(option)} className="size-5 accent-[var(--primary)]" /><span className="font-medium text-card-foreground">{ingredientName(option)}</span></label>)}</div></fieldset> : null}

          {showIngredients ? <fieldset className="mb-6"><legend className="mb-1 font-display text-base font-bold text-card-foreground">{t('customize.ingredients')}</legend><p className="mb-3 text-sm text-muted-foreground">{t('customize.ingredientsHelp')}</p><div className="flex flex-col gap-2">{item.included.map((ingredient) => { const qty = ingredientQty[ingredient.name] ?? 1; const ingredientLabel = ingredientName(ingredient); return <div key={ingredient.name} className={`flex min-h-12 items-center justify-between gap-3 rounded-2xl border-2 px-4 transition-colors ${qty === 0 ? 'border-border bg-card opacity-60' : 'border-primary bg-accent'}`}><span className={`min-w-0 font-medium text-card-foreground ${qty === 0 ? 'line-through' : ''}`}>{ingredientLabel}{qty > 1 ? <span className="ms-1 font-bold" dir="ltr">×{qty}</span> : null}</span><div className="flex shrink-0 items-center gap-2" dir="ltr"><button type="button" onClick={() => setIngredient(ingredient.name, qty - 1)} className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground disabled:opacity-40" disabled={qty <= 0} aria-label={t('customize.decrease', { name: ingredientLabel })}><Minus className="size-4" aria-hidden="true" /></button><span className="w-5 text-center font-bold" aria-live="polite">{qty}</span><button type="button" onClick={() => setIngredient(ingredient.name, qty + 1)} className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground disabled:opacity-40" disabled={qty >= 5} aria-label={t('customize.increase', { name: ingredientLabel })}><Plus className="size-4" aria-hidden="true" /></button></div></div> })}</div></fieldset> : null}

          {item.extras.length ? <fieldset className="mb-6"><legend className="mb-3 font-display text-base font-bold text-card-foreground">{t('customize.extras')}</legend><div className="flex flex-col gap-2">{item.extras.map((extra) => { const checked = selectedExtras.some((entry) => entry.name === extra.name); return <label key={extra.name} className={`flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 px-4 transition-colors ${checked ? 'border-primary bg-accent' : 'border-border bg-card'}`}><span className="flex items-center gap-3"><input type="checkbox" checked={checked} onChange={() => toggleExtra(extra)} className="size-5 accent-[var(--primary)]" /><span className="font-medium text-card-foreground">{ingredientName(extra)}</span></span><span className="text-sm font-semibold text-muted-foreground" dir="ltr">+{formatPrice(extra.price)}</span></label> })}</div></fieldset> : null}

          <div className="flex items-center justify-between"><span className="font-display text-base font-bold text-card-foreground">{t('customize.quantity')}</span><div className="flex items-center gap-3" dir="ltr"><button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="flex size-11 items-center justify-center rounded-full bg-muted text-foreground disabled:opacity-40" disabled={quantity <= 1} aria-label={t('customize.decreaseQuantity')}><Minus className="size-5" aria-hidden="true" /></button><span className="w-8 text-center font-display text-xl font-bold" aria-live="polite">{quantity}</span><button type="button" onClick={() => setQuantity((current) => current + 1)} className="flex size-11 items-center justify-center rounded-full bg-muted text-foreground" aria-label={t('customize.increaseQuantity')}><Plus className="size-5" aria-hidden="true" /></button></div></div>
        </div>
        <div className="flex gap-2 border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button type="button" onClick={handleAdd} className="flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center rounded-full bg-primary px-3 font-bold text-primary-foreground transition-transform active:scale-[0.98]">
            <span className="text-sm leading-tight">{t('customize.addCart')}</span>
            <span className="font-display text-sm leading-tight" dir="ltr" aria-live="polite">{formatPrice(subtotal)}</span>
          </button>
          <button type="button" onClick={handleOrder} className="flex min-h-14 min-w-0 flex-1 items-center justify-center rounded-full bg-whatsapp px-3 text-center text-sm font-bold leading-tight text-whatsapp-foreground transition-transform active:scale-[0.98]">
            {t('cart.quickOrder')}
          </button>
        </div>
      </div>
    </div>
  )
}
