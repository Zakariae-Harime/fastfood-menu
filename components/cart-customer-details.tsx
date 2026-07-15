'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'

type OrderMode = 'sur-place' | 'a-emporter'

interface CartCustomerDetailsProps {
  customerName: string
  customerNote: string
  mode: OrderMode
  onNameChange: (value: string) => void
  onNoteChange: (value: string) => void
  onModeChange: (value: OrderMode) => void
}

export function CartCustomerDetails({
  customerName,
  customerNote,
  mode,
  onNameChange,
  onNoteChange,
  onModeChange,
}: CartCustomerDetailsProps) {
  const { t } = useLanguage()
  const [noteOpen, setNoteOpen] = useState(customerNote.length > 0)

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-card-foreground">{t('cart.name')}</span>
        <input
          type="text"
          value={customerName}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder={t('cart.namePlaceholder')}
          className="min-h-11 rounded-2xl border-2 border-border bg-card px-4 text-base text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </label>

      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t('cart.mode')}>
        {(['sur-place', 'a-emporter'] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={mode === value}
            onClick={() => onModeChange(value)}
            className={`min-h-11 rounded-2xl border-2 px-2 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${mode === value ? 'border-primary bg-accent text-accent-foreground' : 'border-border text-muted-foreground'}`}
          >
            {t(value === 'sur-place' ? 'cart.eatIn' : 'cart.takeaway')}
          </button>
        ))}
      </div>

      <div className="border-t border-border pt-1">
        <button
          type="button"
          aria-expanded={noteOpen}
          aria-controls="cart-note-fields"
          onClick={() => setNoteOpen((open) => !open)}
          className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl text-start text-sm font-semibold text-card-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>{t(noteOpen ? 'cart.hideNote' : 'cart.addNote')}</span>
          <ChevronDown className={`size-4 shrink-0 transition-transform ${noteOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
        {noteOpen ? (
          <div id="cart-note-fields" className="pt-1">
            <textarea
              value={customerNote}
              onChange={(event) => onNoteChange(event.target.value)}
              placeholder={t('cart.notePlaceholder')}
              maxLength={300}
              rows={2}
              className="min-h-20 w-full resize-none rounded-2xl border-2 border-border bg-card px-4 py-2.5 text-base leading-relaxed text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              aria-describedby="cart-note-help"
            />
            <p id="cart-note-help" className="mt-1 text-xs leading-relaxed text-muted-foreground">{t('cart.noteHelp')}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
