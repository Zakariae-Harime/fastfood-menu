'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, X } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { CartDrawer } from '@/components/cart-drawer'
import { CustomizeSheet } from '@/components/customize-sheet'
import { LanguageToggle } from '@/components/language-toggle'
import { MenuItemCard } from '@/components/menu-item-card'
import { ScrollReveal } from '@/components/scroll-reveal'
import { CartProvider } from '@/lib/cart-context'
import { useLanguage } from '@/lib/language-context'
import { MENU_CATEGORIES, type MenuCategory, type MenuItem } from '@/lib/types'
import { useMenu } from '@/lib/use-menu'

function MenuContent() {
  const { items, isLoading, error } = useMenu()
  const { t, categoryName, isRtl } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<MenuCategory>(MENU_CATEGORIES[0])
  const [customizing, setCustomizing] = useState<MenuItem | null>(null)
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase())

  const categories = useMemo(() => {
    const available = new Set(items.filter((item) => item.available).map((item) => item.category))
    return MENU_CATEGORIES.filter((category) => available.has(category))
  }, [items])

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (item.category !== activeCategory || !item.available) return false
        if (!deferredQuery) return true
        const searchable = [
          item.name_fr,
          item.name_darija,
          ...item.included.flatMap((ingredient) => [ingredient.name, ingredient.name_darija]),
        ]
          .join(' ')
          .toLocaleLowerCase()
        return searchable.includes(deferredQuery)
      }),
    [activeCategory, deferredQuery, items],
  )

  function selectCategory(category: MenuCategory, button?: HTMLButtonElement) {
    setActiveCategory(category)
    button?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  return (
    <>
      <div
        className="menu-loading-screen"
        role="status"
        aria-label="Chargement du menu Maestro"
      >
        <img
          src="/maestro-loading.png"
          alt="Maestro Fast Food"
          className="menu-loading-logo"
          fetchPriority="high"
        />
        <span className="sr-only">Chargement du menu…</span>
      </div>

      <main className="min-h-dvh pb-28">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 pt-2 sm:pt-3">
          <Link
            href="/"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t('nav.backHome')}
          >
            <ArrowLeft className={`size-5 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
          </Link>
          <div className="flex min-w-0 flex-1 items-center gap-2" dir="ltr">
            <BrandLogo compact />
            <p className="hidden text-xs font-semibold uppercase tracking-widest text-primary sm:block">{t('menu.title')}</p>
          </div>
          <LanguageToggle />
        </div>

        <div className="relative mx-auto mt-2 max-w-6xl px-4">
          <Search className="pointer-events-none absolute start-8 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('menu.search')}
            aria-label={t('menu.searchLabel')}
            className="min-h-12 w-full rounded-full border border-border bg-card pe-12 ps-12 text-base text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute end-5 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={t('menu.clearSearch')}
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <nav className="scrollbar-none mx-auto flex max-w-6xl snap-x snap-mandatory gap-2 overflow-x-auto scroll-px-4 px-4 py-2.5 sm:py-3" aria-label={t('menu.categories')}>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={(event) => selectCategory(category, event.currentTarget)}
              aria-pressed={activeCategory === category}
              className={`min-h-11 shrink-0 snap-start cursor-pointer rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-5 ${
                activeCategory === category
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border bg-card text-foreground hover:border-primary active:bg-accent'
              }`}
            >
              {categoryName(category)}
            </button>
          ))}
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-4 pt-4 sm:pt-5" aria-labelledby="active-menu-category">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t('menu.title')}</p>
            <h2 id="active-menu-category" className="font-display text-2xl font-black uppercase tracking-tight text-balance sm:text-3xl">
              {categoryName(activeCategory)}
            </h2>
          </div>
          <span className="shrink-0 text-sm tabular-nums text-muted-foreground" aria-live="polite">
            {isLoading ? null : t('menu.results', { count: filtered.length })}
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3" aria-label={t('menu.title')}>
            {[1, 2, 3].map((i) => <div key={i} className="h-40 animate-pulse rounded-3xl bg-muted sm:h-44" aria-hidden="true" />)}
          </div>
        ) : null}
        {error && !isLoading ? <p className="py-12 text-center text-muted-foreground">{t('menu.error')}</p> : null}
        {!isLoading && !error ? (
          filtered.length ? (
            <div key={`${activeCategory}-${deferredQuery}`} className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {filtered.map((item, index) => (
                <ScrollReveal key={item.id} delay={(index % 3) * 70}>
                  <MenuItemCard item={item} onCustomize={setCustomizing} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-muted-foreground">{t('menu.empty')}</p>
          )
        ) : null}
      </section>

        <CustomizeSheet item={customizing} onClose={() => setCustomizing(null)} />
        <CartDrawer />
      </main>
    </>
  )
}

export function MenuClient() {
  return (
    <CartProvider>
      <MenuContent />
    </CartProvider>
  )
}
