'use client'

import { useDeferredValue, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, X } from 'lucide-react'
import { CartDrawer } from '@/components/cart-drawer'
import { CustomizeSheet } from '@/components/customize-sheet'
import { LanguageToggle } from '@/components/language-toggle'
import { MenuItemCard } from '@/components/menu-item-card'
import { ScrollReveal } from '@/components/scroll-reveal'
import { CartProvider } from '@/lib/cart-context'
import { SHOP_INFO } from '@/lib/config'
import { useLanguage } from '@/lib/language-context'
import type { MenuCategory, MenuItem } from '@/lib/types'
import { useMenu } from '@/lib/use-menu'

const CATEGORIES: MenuCategory[] = ['Sandwichs', 'Boissons', 'Extras']

function MenuContent() {
  const { items, isLoading, error } = useMenu()
  const { t, categoryName, isRtl } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Sandwichs')
  const [customizing, setCustomizing] = useState<MenuItem | null>(null)
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase())

  const filtered = items.filter((item) => {
    if (item.category !== activeCategory) return false
    if (!deferredQuery) return true
    const searchable = [item.name_fr, item.name_darija, ...item.included.flatMap((ingredient) => [ingredient.name, ingredient.name_darija])].join(' ').toLocaleLowerCase()
    return searchable.includes(deferredQuery)
  })

  return (
    <main className="min-h-dvh pb-28">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 pt-4">
          <Link href="/" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card shadow-sm" aria-label={t('nav.backHome')}>
            <ArrowLeft className={`size-5 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-xl font-black uppercase tracking-tight" dir="ltr">{SHOP_INFO.name}</h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t('menu.title')}</p>
          </div>
          <LanguageToggle />
        </div>

        <div className="relative mx-4 mt-3">
          <Search className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('menu.search')} aria-label={t('menu.searchLabel')} className="min-h-12 w-full rounded-full border border-border bg-card pe-12 ps-12 text-base text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25" />
          {query ? <button type="button" onClick={() => setQuery('')} className="absolute end-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground" aria-label={t('menu.clearSearch')}><X className="size-5" aria-hidden="true" /></button> : null}
        </div>

        <nav className="scrollbar-none flex gap-2 overflow-x-auto px-4 py-3" aria-label={t('menu.categories')}>
          {CATEGORIES.map((category) => (
            <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`min-h-11 shrink-0 rounded-full px-6 font-semibold transition-colors ${activeCategory === category ? 'bg-foreground text-background' : 'bg-card text-muted-foreground shadow-sm'}`}>
              {categoryName(category)}
            </button>
          ))}
        </nav>
      </header>

      <section className="px-4 pt-2" aria-label={categoryName(activeCategory)}>
        {isLoading ? <div className="flex flex-col gap-4" aria-label={t('menu.title')}>{[1, 2, 3].map((i) => <div key={i} className="h-64 animate-pulse rounded-3xl bg-muted" aria-hidden="true" />)}</div> : null}
        {error && !isLoading ? <p className="py-12 text-center text-muted-foreground">{t('menu.error')}</p> : null}
        {!isLoading && !error ? (
          <>
            {query ? <p className="mb-3 text-sm text-muted-foreground" role="status">{t('menu.results', { count: filtered.length })}</p> : null}
            {filtered.length ? <div key={`${activeCategory}-${deferredQuery}`} className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">{filtered.map((item, index) => <ScrollReveal key={item.id} delay={(index % 3) * 100}><MenuItemCard item={item} onCustomize={setCustomizing} /></ScrollReveal>)}</div> : <p className="py-12 text-center text-muted-foreground">{t('menu.empty')}</p>}
          </>
        ) : null}
      </section>

      <CustomizeSheet item={customizing} onClose={() => setCustomizing(null)} />
      <CartDrawer />
    </main>
  )
}

export function MenuClient() {
  return <CartProvider><MenuContent /></CartProvider>
}
