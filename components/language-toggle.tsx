'use client'

import { useLanguage, type Language } from '@/lib/language-context'
import { cn } from '@/lib/utils'

export function LanguageToggle({ inverted = false }: { inverted?: boolean }) {
  const { language, setLanguage, t } = useLanguage()
  const options: { value: Language; label: string }[] = [
    { value: 'fr', label: 'FR' },
    { value: 'darija', label: 'الدارجة' },
  ]

  return (
    <div
      className={cn(
        'inline-flex min-h-11 items-center rounded-full border p-1 shadow-sm',
        inverted ? 'border-white/30 bg-black/35 text-white backdrop-blur-sm' : 'border-border bg-card text-card-foreground',
      )}
      role="group"
      aria-label={t('language.label')}
      dir="ltr"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLanguage(option.value)}
          aria-pressed={language === option.value}
          lang={option.value === 'darija' ? 'ar-MA' : 'fr'}
          className={cn(
            'min-h-9 rounded-full px-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            language === option.value
              ? 'bg-primary text-primary-foreground'
              : inverted ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
