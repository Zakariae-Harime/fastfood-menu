'use client'

import Image from 'next/image'
import { ScrollReveal } from '@/components/scroll-reveal'
import { useLanguage } from '@/lib/language-context'
import { formatPrice } from '@/lib/types'
import { useMenu } from '@/lib/use-menu'

const railClassName =
  'mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4'

const featuredDishes = [
  {
    id: 'frais-thon',
    nameFr: 'Sandwich Thon',
    image: 'https://i.pinimg.com/originals/eb/be/11/ebbe112c09ddd5379900887a40df1ba8.jpg',
  },
  {
    id: 'tacos-poulet',
    nameFr: 'Tacos Poulet',
    image: 'https://images.unsplash.com/photo-1613319300745-88bc37cceccf?ixlib=rb-4.1.0&q=90&fm=jpg&crop=entropy&cs=srgb&w=1800',
  },
  { id: 'shawarma', nameFr: 'Shawarma Poulet', image: '/images/categories/Shawarma.png' },
  { id: 'plat-tortilla', nameFr: 'Plat Tortilla', image: '/images/categories/PlatSpecial.png' },
] as const

export function SpecialtiesGrid() {
  const { items, isLoading } = useMenu()
  const { language, itemName, ingredientName } = useLanguage()
  const featured = featuredDishes.flatMap((dish) => {
    const item = items.find((candidate) => candidate.id === dish.id)
    return item ? [{ ...item, image: dish.image, featuredName: dish.nameFr }] : []
  })

  if (isLoading) {
    return (
      <div className={railClassName} aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-72 animate-pulse rounded-3xl bg-card" />
        ))}
      </div>
    )
  }

  if (featured.length === 0) return null

  return (
    <div className={railClassName}>
      {featured.map((item, index) => {
        const name = language === 'fr' ? item.featuredName : itemName(item)
        const description = item.included.map(ingredientName).join(' · ')

        return (
          <ScrollReveal
            key={item.id}
            delay={index * 120}
            className="min-w-0"
          >
            <article className="group h-full overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={name}
                  width={640}
                  height={420}
                  sizes="(max-width: 639px) 84vw, (max-width: 1023px) 30vw, 280px"
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] sm:h-44"
                />
              ) : null}
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-bold leading-tight text-card-foreground">{name}</h3>
                  <span
                    className="shrink-0 rounded-full bg-accent px-3 py-1.5 font-display text-sm font-black tabular-nums text-accent-foreground"
                    dir="ltr"
                  >
                    {formatPrice(item.base_price)}
                  </span>
                </div>
                {description ? <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
              </div>
            </article>
          </ScrollReveal>
        )
      })}
    </div>
  )
}
