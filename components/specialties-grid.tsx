'use client'

import Image from 'next/image'
import { ScrollReveal } from '@/components/scroll-reveal'
import { useLanguage } from '@/lib/language-context'
import { formatPrice } from '@/lib/types'
import { useMenu } from '@/lib/use-menu'

const railClassName =
  'scrollbar-none -mx-6 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-3 sm:mx-0 sm:mt-10 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0'

export function SpecialtiesGrid() {
  const { featured, isLoading } = useMenu()
  const { itemName, ingredientName } = useLanguage()

  if (isLoading) {
    return (
      <div className={railClassName} aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-72 shrink-0 basis-[84%] snap-start animate-pulse rounded-3xl bg-card sm:basis-auto" />
        ))}
      </div>
    )
  }

  if (featured.length === 0) return null

  return (
    <div className={railClassName}>
      {featured.map((item, index) => {
        const name = itemName(item)
        const description = item.included.map(ingredientName).join(' · ')

        return (
          <ScrollReveal
            key={item.id}
            delay={index * 120}
            className="min-w-0 shrink-0 basis-[84%] snap-start sm:basis-auto"
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
