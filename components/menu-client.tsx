'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CartDrawer } from '@/components/cart-drawer'
import { CustomizeSheet } from '@/components/customize-sheet'
import { MenuItemCard } from '@/components/menu-item-card'
import { ScrollReveal } from '@/components/scroll-reveal'
import { CartProvider } from '@/lib/cart-context'
import { SHOP_INFO } from '@/lib/config'
import type { MenuCategory, MenuItem } from '@/lib/types'
import { useMenu } from '@/lib/use-menu'

const CATEGORIES: MenuCategory[] = ['Sandwichs', 'Boissons', 'Extras']

function MenuContent() {
  const { items, isLoading, error } = useMenu()
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Sandwichs')
  const [customizing, setCustomizing] = useState<MenuItem | null>(null)

  const filtered = items.filter((item) => item.category === activeCategory)

  return (
    <main className="min-h-dvh pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 pt-4">
          <Link
            href="/"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card shadow-sm"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-black uppercase tracking-tight">
              {SHOP_INFO.name}
            </h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Le Menu</p>
          </div>
        </div>

        {/* Category tabs */}
        <nav
          className="scrollbar-none flex gap-2 overflow-x-auto px-4 py-3"
          aria-label="Catégories du menu"
        >
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={`min-h-11 shrink-0 rounded-full px-6 font-semibold transition-colors ${
                activeCategory === category
                  ? 'bg-foreground text-background'
                  : 'bg-card text-muted-foreground shadow-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </nav>
      </header>

      {/* Items */}
      <section className="px-4 pt-2" aria-label={activeCategory}>
        {isLoading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-3xl bg-muted" />
            ))}
          </div>
        )}

        {error && !isLoading && (
          <p className="py-12 text-center text-muted-foreground">
            Impossible de charger le menu. Veuillez réessayer.
          </p>
        )}

        {!isLoading && !error && (
          <div key={activeCategory} className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, index) => (
              <ScrollReveal key={item.id} delay={(index % 3) * 100}>
                <MenuItemCard item={item} onCustomize={setCustomizing} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      <CustomizeSheet item={customizing} onClose={() => setCustomizing(null)} />
      <CartDrawer />
    </main>
  )
}

export function MenuClient() {
  return (
    <CartProvider>
      <MenuContent />
    </CartProvider>
  )
}
