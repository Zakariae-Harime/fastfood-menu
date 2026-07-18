'use client'

import { ExternalLink, Star } from 'lucide-react'
import { ScrollReveal } from '@/components/scroll-reveal'
import { GOOGLE_REVIEW_URL } from '@/lib/config'
import { useLanguage } from '@/lib/language-context'
import { useReviews } from '@/lib/use-reviews'

function Rating({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`size-4 ${index < rating ? 'fill-primary text-primary' : 'text-border'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export function ReviewsSection() {
  const reviews = useReviews()
  const { t } = useLanguage()

  return (
    <section className="px-6 py-16" aria-labelledby="reviews-title">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {t('reviews.eyebrow')}
          </p>
          <h2
            id="reviews-title"
            className="mt-2 text-center font-display text-3xl font-black uppercase tracking-tight text-balance sm:text-4xl"
          >
            {t('reviews.title')}
          </h2>
        </ScrollReveal>

        {reviews.length > 0 ? (
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:gap-4">
            {reviews.map((review, index) => (
              <ScrollReveal key={review.id} delay={index * 60}>
                <article className="rounded-3xl border border-border bg-card p-5 text-card-foreground sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-lg font-bold">{review.reviewerName}</h3>
                    <Rating
                      rating={review.rating}
                      label={t('reviews.rating', { rating: review.rating })}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
                    {review.text}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        ) : null}

        <ScrollReveal delay={120} className={reviews.length > 0 ? 'mt-6' : 'mt-8'}>
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-center font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]"
          >
            {t('reviews.cta')}
            <ExternalLink className="size-5" aria-hidden="true" />
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}
