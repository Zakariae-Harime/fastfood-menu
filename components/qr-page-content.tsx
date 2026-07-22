'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LanguageToggle } from '@/components/language-toggle'
import { QrCard } from '@/components/qr-card'
import { useLanguage } from '@/lib/language-context'

export function QrPageContent() {
  const { t, isRtl } = useLanguage()
  return <main className="min-h-dvh px-6 py-12"><div className="mx-auto flex max-w-3xl flex-col gap-10"><div className="flex flex-col items-center gap-3 text-center"><div className="flex w-full items-center justify-between gap-3"><Link href="/" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className={`size-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />{t('nav.home')}</Link><LanguageToggle /></div><p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{t('qr.printEyebrow')}</p><h1 className="font-display text-3xl font-black uppercase tracking-tight text-balance sm:text-4xl">QR Codes</h1><p className="max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">{t('qr.pageDescription')}</p></div><div className="mx-auto w-full max-w-sm"><QrCard title={t('menu.title')} description={t('qr.cardDescription')} url={`${SITE_URL}/menu`} fileName="snack-maestro-menu-qr.png" /></div></div></main>
}
