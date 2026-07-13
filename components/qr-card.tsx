'use client'

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import QRCode from 'qrcode'
import { useLanguage } from '@/lib/language-context'

interface QrCardProps { title: string; description: string; url: string; fileName: string }

export function QrCard({ title, description, url, fileName }: QrCardProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const { t } = useLanguage()
  useEffect(() => { let cancelled = false; QRCode.toDataURL(url, { width: 640, margin: 2, errorCorrectionLevel: 'H', color: { dark: '#1c1917', light: '#ffffff' } }).then((generated) => { if (!cancelled) setDataUrl(generated) }); return () => { cancelled = true } }, [url])
  return <article className="flex flex-col items-center gap-4 rounded-3xl bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"><div className="flex flex-col gap-1"><h2 className="font-display text-xl font-bold text-card-foreground">{title}</h2><p className="text-sm leading-relaxed text-muted-foreground">{description}</p></div><div className="overflow-hidden rounded-2xl border border-border bg-white p-3">{dataUrl ? <img src={dataUrl} alt={t('qr.alt', { url })} className="size-48 sm:size-56" /> : <div className="size-48 animate-pulse rounded-xl bg-muted sm:size-56" role="status" aria-label={t('qr.loading')} />}</div><p className="break-all text-xs text-muted-foreground" dir="ltr">{url}</p><a href={dataUrl ?? '#'} download={dataUrl ? fileName : undefined} aria-disabled={!dataUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 aria-disabled:pointer-events-none aria-disabled:opacity-50"><Download className="size-4" aria-hidden="true" />{t('qr.download')}</a></article>
}
