import Link from 'next/link'
import { Clock, Flame, Leaf, MapPin, Phone, UtensilsCrossed } from 'lucide-react'
import { ScrollReveal } from '@/components/scroll-reveal'
import { SHOP_INFO, WHATSAPP_NUMBER } from '@/lib/config'

const SPECIALTIES = [
  {
    name: 'Bocadillo Mixte',
    description: 'Thon, oeuf, frites, olives — le classique de Tanger.',
    price: '30 DH',
    image: '/images/menu/bocadillo-mixte.png',
  },
  {
    name: 'Bocadillo Kefta',
    description: 'Kefta grillée à la minute, oignons et harissa.',
    price: '32 DH',
    image: '/images/menu/bocadillo-kefta.png',
  },
  {
    name: 'Bocadillo Poulet',
    description: 'Poulet mariné grillé, sauce maison.',
    price: '28 DH',
    image: '/images/menu/bocadillo-poulet.png',
  },
]

const VALUES = [
  {
    icon: Flame,
    title: 'Grillé à la minute',
    description: "Chaque bocadillo est préparé à la commande, jamais à l'avance.",
  },
  {
    icon: Leaf,
    title: 'Produits frais',
    description: 'Légumes du marché, pain du jour et sauces maison.',
  },
  {
    icon: Clock,
    title: 'Ouvert tard',
    description: "Tous les jours de 11h00 jusqu'à 02h00 du matin.",
  },
]

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      {/* Hero */}
      <section className="relative flex min-h-dvh flex-col justify-end">
        {/* suppressHydrationWarning: browser extensions (e.g. Ultrawidify) mutate video elements before React hydrates */}
        <video
          src="/videos/hero.mp4"
          poster="/images/hero.png"
          autoPlay
          muted
          loop
          playsInline
          suppressHydrationWarning
          className="absolute inset-0 h-full w-full object-cover"
          aria-label="Chef de Snack Maestro préparant un bocadillo derrière le comptoir"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" aria-hidden="true" />

        <div className="relative z-10 flex flex-col items-center gap-6 px-6 pb-12 pt-32 text-center">
          <div className="animate-hero-rise flex flex-col items-center gap-2">
            <h1 className="font-display text-5xl font-black uppercase tracking-tight text-white text-balance sm:text-7xl">
              Snack Maestro
            </h1>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
              {SHOP_INFO.tagline}
            </p>
          </div>

          <p
            className="animate-hero-rise max-w-md text-base leading-relaxed text-white/90 text-pretty"
            style={{ animationDelay: '150ms' }}
          >
            {SHOP_INFO.intro}
          </p>

          <div className="animate-hero-rise" style={{ animationDelay: '300ms' }}>
            <Link
              href="/menu"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary px-10 text-lg font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
            >
              <UtensilsCrossed className="size-5" aria-hidden="true" />
              Voir le menu
            </Link>
          </div>

          <p className="animate-hero-rise text-xs text-white/50" style={{ animationDelay: '450ms' }}>
            Commandez directement sur WhatsApp — pas de compte, pas de paiement en ligne.
          </p>
        </div>
      </section>

      {/* Specialties */}
      <section className="px-6 py-16" aria-labelledby="specialties-title">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Les incontournables
            </p>
            <h2
              id="specialties-title"
              className="mt-2 text-center font-display text-3xl font-black uppercase tracking-tight text-balance sm:text-4xl"
            >
              Les stars du comptoir
            </h2>
          </ScrollReveal>

          <div className="mt-10 flex flex-col gap-5 sm:grid sm:grid-cols-3">
            {SPECIALTIES.map((item, index) => (
              <ScrollReveal key={item.name} delay={index * 120}>
                <article className="group overflow-hidden rounded-3xl bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-44 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="flex flex-col gap-1.5 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-lg font-bold leading-tight text-card-foreground">
                        {item.name}
                      </h3>
                      <span className="shrink-0 rounded-full bg-accent px-3 py-1 font-display text-sm font-bold text-accent-foreground">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={150} className="mt-8 text-center">
            <Link
              href="/menu"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-8 font-semibold text-background transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
            >
              Découvrir tout le menu
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-card px-6 py-16" aria-labelledby="values-title">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <h2
              id="values-title"
              className="text-center font-display text-3xl font-black uppercase tracking-tight text-card-foreground text-balance sm:text-4xl"
            >
              L&apos;esprit Maestro
            </h2>
          </ScrollReveal>

          <div className="mt-10 flex flex-col gap-6 sm:grid sm:grid-cols-3">
            {VALUES.map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 120}>
                <div className="flex flex-col items-center gap-3 rounded-3xl bg-background p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <span className="flex size-12 items-center justify-center rounded-full bg-accent">
                    <value.icon className="size-6 text-accent-foreground" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-lg font-bold">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-6 py-16" aria-labelledby="contact-title">
        <div className="mx-auto max-w-md">
          <ScrollReveal>
            <h2
              id="contact-title"
              className="text-center font-display text-3xl font-black uppercase tracking-tight text-balance sm:text-4xl"
            >
              Nous trouver
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-card p-6 shadow-sm">
              <a
                href={SHOP_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-card-foreground underline-offset-4 hover:underline"
              >
                <MapPin className="size-5 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-sm">{SHOP_INFO.address}</span>
              </a>
              <a
                href={`tel:+212661393826`}
                className="flex items-center gap-3 text-card-foreground underline-offset-4 hover:underline"
              >
                <Phone className="size-5 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-sm">{SHOP_INFO.phoneDisplay}</span>
              </a>
              <div className="flex items-center gap-3 text-card-foreground">
                <Clock className="size-5 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-sm">{SHOP_INFO.hours}</span>
              </div>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 font-semibold text-whatsapp-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
              >
                <Phone className="size-5" aria-hidden="true" />
                Commander sur WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center">
        <p className="font-display text-sm font-bold uppercase tracking-widest">Snack Maestro</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {SHOP_INFO.address} · {SHOP_INFO.phoneDisplay}
        </p>
      </footer>
    </main>
  )
}
