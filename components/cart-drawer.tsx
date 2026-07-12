'use client'

import { useState } from 'react'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { formatPrice, lineSubtotal } from '@/lib/types'
import { buildOrderMessage, buildWhatsAppUrl } from '@/lib/whatsapp'

export function CartDrawer() {
  const { lines, updateQuantity, removeLine, itemCount, total } = useCart()
  const [open, setOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [mode, setMode] = useState<'sur-place' | 'a-emporter'>('a-emporter')

  const handleOrder = () => {
    const message = buildOrderMessage(lines, customerName, mode)
    const url = buildWhatsAppUrl(message)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* Floating cart button */}
      {itemCount > 0 && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex min-h-14 items-center gap-3 rounded-full bg-foreground px-5 text-background shadow-xl transition-transform active:scale-95"
          aria-label={`Ouvrir le panier, ${itemCount} articles, total ${formatPrice(total)}`}
        >
          <span className="relative">
            <ShoppingBag className="size-6" aria-hidden="true" />
            <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {itemCount}
            </span>
          </span>
          <span className="font-display text-base font-bold">{formatPrice(total)}</span>
        </button>
      )}

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Panier">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-label="Fermer le panier"
          />

          <div className="absolute inset-x-0 bottom-0 flex max-h-[90dvh] flex-col rounded-t-3xl bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="font-display text-xl font-bold text-card-foreground">
                Votre panier
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground"
                aria-label="Fermer"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {lines.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">Votre panier est vide.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {lines.map((line) => (
                    <li key={line.uid} className="rounded-2xl border border-border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-card-foreground">{line.item.name_fr}</p>
                          {line.bread && (
                            <p className="text-sm text-muted-foreground">Pain: {line.bread}</p>
                          )}
                          {line.extras.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              {line.extras.map((e) => e.name).join(', ')}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLine(line.uid)}
                          className="flex size-9 shrink-0 items-center justify-center rounded-full text-destructive"
                          aria-label={`Retirer ${line.item.name_fr} du panier`}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.uid, line.quantity - 1)}
                            className="flex size-9 items-center justify-center rounded-full bg-muted"
                            aria-label="Diminuer la quantité"
                          >
                            <Minus className="size-4" aria-hidden="true" />
                          </button>
                          <span className="w-6 text-center font-bold" aria-live="polite">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.uid, line.quantity + 1)}
                            className="flex size-9 items-center justify-center rounded-full bg-muted"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                        <span className="font-display font-bold text-card-foreground">
                          {formatPrice(lineSubtotal(line))}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                {/* Customer name */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-card-foreground">Votre nom</span>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Youssef"
                    className="min-h-12 rounded-2xl border-2 border-border bg-card px-4 text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </label>

                {/* Mode toggle */}
                <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Mode de commande">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={mode === 'sur-place'}
                    onClick={() => setMode('sur-place')}
                    className={`min-h-12 rounded-2xl border-2 font-semibold transition-colors ${
                      mode === 'sur-place'
                        ? 'border-primary bg-accent text-accent-foreground'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    Sur place
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={mode === 'a-emporter'}
                    onClick={() => setMode('a-emporter')}
                    className={`min-h-12 rounded-2xl border-2 font-semibold transition-colors ${
                      mode === 'a-emporter'
                        ? 'border-primary bg-accent text-accent-foreground'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    À emporter
                  </button>
                </div>

                {/* Total + order */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-display text-2xl font-black text-card-foreground">
                    {formatPrice(total)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleOrder}
                  className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-whatsapp font-bold text-whatsapp-foreground transition-transform active:scale-[0.98]"
                >
                  <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Commander sur WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
