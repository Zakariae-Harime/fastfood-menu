'use client'

import { useEffect, useState } from 'react'
import { SHOP_INFO } from '@/lib/config'
import { useLanguage } from '@/lib/language-context'

function parseTime(time: string) { const [hours, minutes] = time.split(':').map(Number); return hours * 60 + minutes }
function computeIsOpen() { const now = new Date(); const current = now.getHours() * 60 + now.getMinutes(); const open = parseTime(SHOP_INFO.openTime); const close = parseTime(SHOP_INFO.closeTime); return close > open ? current >= open && current < close : current >= open || current < close }

export function OpenStatusBadge() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null)
  const { t } = useLanguage()
  useEffect(() => { setIsOpen(computeIsOpen()); const id = setInterval(() => setIsOpen(computeIsOpen()), 60_000); return () => clearInterval(id) }, [])
  if (isOpen === null) return null
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${isOpen ? 'bg-green-500/15 text-green-700' : 'bg-muted text-muted-foreground'}`}><span className={`size-1.5 rounded-full ${isOpen ? 'bg-green-600' : 'bg-muted-foreground'}`} aria-hidden="true" />{isOpen ? t('status.open') : t('status.closed', { time: SHOP_INFO.openTime })}</span>
}
