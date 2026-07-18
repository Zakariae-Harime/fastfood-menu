'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ShoppingBag, X } from 'lucide-react'
import { CartCustomerDetails } from '@/components/cart-customer-details'
import { CartLineItem } from '@/components/cart-line-item'
import { useCart } from '@/lib/cart-context'
import { useLanguage } from '@/lib/language-context'
import { lockPageScroll } from '@/lib/page-scroll-lock'
import { formatPrice } from '@/lib/types'
import { buildOrderMessage, buildWhatsAppUrl } from '@/lib/whatsapp'

export function CartDrawer() {
  const { lines, updateQuantity, removeLine, itemCount, total } = useCart()
  const { t, language } = useLanguage()
  const [open, setOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerNote, setCustomerNote] = useState('')
  const [mode, setMode] = useState<'sur-place' | 'a-emporter'>('a-emporter')
  const cartButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const closeCart = useCallback(() => {
    setOpen(false)
    requestAnimationFrame(() => cartButtonRef.current?.focus())
  }, [])

  useEffect(() => {
    if (!open) return
    const unlockPageScroll = lockPageScroll()
    closeButtonRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      unlockPageScroll()
    }
  }, [open, closeCart])

  const handleOrder = () => window.open(
    buildWhatsAppUrl(buildOrderMessage(lines, customerName, mode, language, customerNote)),
    '_blank',
    'noopener,noreferrer',
  )

  return (
    <>
      {itemCount > 0 && !open ? (
        <div className="fixed inset-x-4 bottom-5 z-40 flex items-center justify-end gap-2 sm:inset-x-auto sm:end-5">
          <button
            type="button"
            onClick={handleOrder}
            className="flex min-h-14 flex-1 items-center justify-center rounded-full bg-whatsapp px-5 font-display text-sm font-bold text-whatsapp-foreground shadow-xl transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex-none sm:text-base"
          >
            {t('cart.quickOrder')}
          </button>
          <button
            ref={cartButtonRef}
            type="button"
            onClick={() => setOpen(true)}
            className="flex min-h-14 shrink-0 items-center gap-3 rounded-full bg-foreground px-5 text-background shadow-xl transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={t('cart.open', { count: itemCount, total: formatPrice(total) })}
          >
            <span className="relative">
              <ShoppingBag className="size-6" aria-hidden="true" />
              <span className="absolute -end-2 -top-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground" dir="ltr">{itemCount}</span>
            </span>
            <span className="font-display text-base font-bold" dir="ltr">{formatPrice(total)}</span>
          </button>
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-50 overscroll-none" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <button type="button" className="absolute inset-0 bg-black/50" onClick={closeCart} aria-label={t('cart.close')} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-3xl bg-card shadow-2xl">
            <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <h2 id="cart-title" className="font-display text-xl font-bold text-card-foreground">{t('cart.title')}</h2>
                <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground" aria-live="polite">
                  {t('cart.itemCount', { count: itemCount })}
                </span>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeCart}
                className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label={t('cart.close')}
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 overscroll-contain">
              {lines.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">{t('cart.empty')}</p>
              ) : (
                <div className="flex flex-col gap-4">
                  <ul className="flex flex-col gap-3">
                    {lines.map((line) => (
                      <CartLineItem key={line.uid} line={line} onQuantityChange={updateQuantity} onRemove={removeLine} />
                    ))}
                  </ul>
                  <CartCustomerDetails
                    customerName={customerName}
                    customerNote={customerNote}
                    mode={mode}
                    onNameChange={setCustomerName}
                    onNoteChange={setCustomerNote}
                    onModeChange={setMode}
                  />
                </div>
              )}
            </div>

            {lines.length ? (
              <footer className="shrink-0 border-t border-border bg-card px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="text-muted-foreground">{t('cart.total')}</span>
                  <span className="font-display text-2xl font-black text-card-foreground" dir="ltr">{formatPrice(total)}</span>
                </div>
                <button type="button" onClick={handleOrder} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-whatsapp font-bold text-whatsapp-foreground transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                  <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" /></svg>
                  {t('cart.order')}
                </button>
              </footer>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}
