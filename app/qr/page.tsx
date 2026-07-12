import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { QrCard } from '@/components/qr-card'

const SITE_URL = 'https://snack-maestro.vercel.app'

export const metadata: Metadata = {
  title: 'QR Codes — Snack Maestro',
  description: 'QR codes à imprimer pour accéder au site et au menu de Snack Maestro.',
}

export default function QrPage() {
  return (
    <main className="min-h-dvh px-6 py-12">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Accueil
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">À imprimer</p>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-balance sm:text-4xl">
            QR Codes
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
            Scannez ou imprimez ces QR codes pour vos tables, vitrines et flyers. Chaque code
            redirige directement vers le site ou le menu.
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:grid sm:grid-cols-2">
          <QrCard
            title="Site web"
            description="Redirige vers la page d'accueil de Snack Maestro."
            url={SITE_URL}
            fileName="snack-maestro-site-qr.png"
          />
          <QrCard
            title="Menu"
            description="Redirige directement vers le menu complet."
            url={`${SITE_URL}/menu`}
            fileName="snack-maestro-menu-qr.png"
          />
        </div>
      </div>
    </main>
  )
}
