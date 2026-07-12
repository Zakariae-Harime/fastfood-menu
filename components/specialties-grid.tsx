'use client'

import { useMenu } from '@/lib/use-menu'
import { formatPrice } from '@/lib/types'
import { ScrollReveal } from '@/components/scroll-reveal'

export function SpecialtiesGrid() {
  const { featured, isLoading } = useMenu()

  if (isLoading) {
    return (
      <div className="mt-10 flex flex-col gap-5 sm:grid sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-72 animate-pulse rounded-3xl bg-card" aria-hidden="true" />
        ))}
      </div>
    )
  }

  if (featured.length === 0) return null

  return (
    <div className="mt-10 flex flex-col gap-5 sm:grid sm:grid-cols-3">
      {featured.map((item, index) => (
        <ScrollReveal key={item.id} delay={index * 120}>
          <article className="group overflow-hidden rounded-3xl bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            {item.image && (
              <img
                src={item.image}
                alt={item.name_fr}
                className="h-44 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
              />
            )}
            <div className="flex flex-col gap-1.5 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg font-bold leading-tight text-card-foreground">
                  {item.name_fr}
                </h3>
                <span className="shrink-0 rounded-full bg-accent px-3 py-1 font-display text-sm font-bold text-accent-foreground">
                  {formatPrice(item.base_price)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.included.join(' · ')}
              </p>
            </div>
          </article>
        </ScrollReveal>
      ))}
    </div>
  )
}
