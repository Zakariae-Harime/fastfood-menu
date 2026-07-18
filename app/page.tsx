'use client'

import Link from 'next/link'
import { Clock, Flame, Leaf, Navigation, UtensilsCrossed } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { HeroVideo } from '@/components/hero-video'
import { LanguageToggle } from '@/components/language-toggle'
import { LocationMap } from '@/components/location-map'
import { QrCard } from '@/components/qr-card'
import { ReviewsSection } from '@/components/reviews-section'
import { ScrollReveal } from '@/components/scroll-reveal'
import { SpecialtiesGrid } from '@/components/specialties-grid'
import { SHOP_INFO } from '@/lib/config'
import { useLanguage } from '@/lib/language-context'

const SITE_URL = 'https://snack-maestro.vercel.app'
const VALUES = [
  { icon: Flame, key: 'grilled' },
  { icon: Leaf, key: 'fresh' },
  { icon: Clock, key: 'late' },
] as const

export default function HomePage() {
  const { t, language } = useLanguage()

  return (
    <main className="min-h-dvh">
      <section className="relative flex min-h-dvh flex-col justify-end">
        <HeroVideo />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 z-20 flex justify-end p-4 sm:p-6">
          <LanguageToggle inverted />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-6 px-6 pb-12 pt-32 text-center">
          <div className="animate-hero-rise flex flex-col items-center gap-1">
            <h1 className="sr-only">Maestro Fast Food Tanger</h1>
            <BrandLogo inverted />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t('hero.tagline')}</p>
          </div>
          <p className="animate-hero-rise max-w-md text-base leading-relaxed text-white/90 text-pretty" style={{ animationDelay: '150ms' }}>
            {t('hero.intro')}
          </p>
          <div className="animate-hero-rise flex flex-col items-stretch gap-3 sm:flex-row sm:items-center" style={{ animationDelay: '300ms' }}>
            <Link href="/menu" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary px-10 text-lg font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95">
              <UtensilsCrossed className="size-5" aria-hidden="true" />
              {t('hero.menu')}
            </Link>
            <a href="#itineraire" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/40 bg-black/30 px-8 font-bold text-white backdrop-blur-sm hover:-translate-y-0.5 hover:border-white/70 hover:bg-black/50 active:scale-95">
              <Navigation className="size-5" aria-hidden="true" />
              {t('hero.route')}
            </a>
          </div>
          <p className="animate-hero-rise text-xs text-white/60" style={{ animationDelay: '450ms' }}>{t('hero.note')}</p>
        </div>
      </section>

      <section className="px-6 py-16" aria-labelledby="specialties-title">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary">{t('specialties.eyebrow')}</p>
            <h2 id="specialties-title" className="mt-2 text-center font-display text-3xl font-black uppercase tracking-tight text-balance sm:text-4xl">{t('specialties.title')}</h2>
          </ScrollReveal>
          <SpecialtiesGrid />
          <ScrollReveal delay={150} className="mt-8 text-center">
            <Link href="/menu" className="inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-8 font-semibold text-background transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95">{t('specialties.all')}</Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-card px-6 py-16" aria-labelledby="values-title">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal><h2 id="values-title" className="text-center font-display text-3xl font-black uppercase tracking-tight text-card-foreground text-balance sm:text-4xl">{t('values.title')}</h2></ScrollReveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-6">
            {VALUES.map((value, index) => (
              <ScrollReveal
                key={value.key}
                delay={index * 120}
                className={`${index === 2 ? 'col-span-2' : 'col-span-1'} sm:col-span-1`}
              >
                <div className="flex h-full flex-col items-start gap-2.5 rounded-3xl bg-background p-4 text-start transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:items-center sm:gap-3 sm:p-6 sm:text-center">
                  <span className="flex size-10 items-center justify-center rounded-full bg-accent sm:size-12"><value.icon className="size-5 text-accent-foreground sm:size-6" aria-hidden="true" /></span>
                  <h3 className="font-display text-base font-bold leading-tight sm:text-lg">{t(`values.${value.key}.title`)}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{t(`values.${value.key}.description`)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection />

      <section className="px-6 py-16" aria-labelledby="contact-title">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary">{t('contact.eyebrow')}</p>
            <h2 id="contact-title" className="mt-2 text-center font-display text-3xl font-black uppercase tracking-tight text-balance sm:text-4xl">{t('contact.title')}</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed text-muted-foreground text-pretty">{t('contact.description')}</p>
          </ScrollReveal>
          <ScrollReveal delay={120}><div className="mt-8"><LocationMap /></div></ScrollReveal>
        </div>
      </section>

      <section className="bg-card px-6 py-16" aria-labelledby="qr-title">
        <div className="mx-auto max-w-md">
          <ScrollReveal>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary">{t('qr.eyebrow')}</p>
            <h2 id="qr-title" className="mt-2 text-center font-display text-3xl font-black uppercase tracking-tight text-card-foreground text-balance sm:text-4xl">{t('qr.title')}</h2>
            <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-relaxed text-muted-foreground text-pretty">{t('qr.description')}</p>
          </ScrollReveal>
          <ScrollReveal delay={120} className="mt-8"><QrCard title={t('qr.cardTitle')} description={t('qr.cardDescription')} url={`${SITE_URL}/menu`} fileName="snack-maestro-menu-qr.png" /></ScrollReveal>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-8 text-center">
        <p className="font-display text-sm font-bold uppercase tracking-widest" dir="ltr">Snack Maestro</p>
        <p className="mt-1 text-xs text-muted-foreground" dir="ltr">{SHOP_INFO.address} · {SHOP_INFO.phoneDisplay}</p>
        <Link href="/qr" className="mt-3 inline-block text-xs text-muted-foreground underline-offset-4 hover:underline">{t('qr.print')}</Link>
      </footer>
    </main>
  )
}
