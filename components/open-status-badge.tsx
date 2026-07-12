'use client'

import { useEffect, useState } from 'react'
import { SHOP_INFO } from '@/lib/config'

function parseTime(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

// Handles overnight windows (e.g. 11:00 – 02:00) automatically: if the
// closing time is numerically before the opening time, we're open from
// openTime through midnight, then from midnight through closeTime.
function computeIsOpen(): boolean {
  const now = new Date()
  const minutesNow = now.getHours() * 60 + now.getMinutes()
  const open = parseTime(SHOP_INFO.openTime)
  const close = parseTime(SHOP_INFO.closeTime)

  if (close > open) return minutesNow >= open && minutesNow < close
  return minutesNow >= open || minutesNow < close
}

export function OpenStatusBadge() {
  // null until mounted, so the server-rendered markup and the first client
  // render match (avoids a hydration mismatch / flash of wrong state)
  const [isOpen, setIsOpen] = useState<boolean | null>(null)

  useEffect(() => {
    setIsOpen(computeIsOpen())
    const id = setInterval(() => setIsOpen(computeIsOpen()), 60_000)
    return () => clearInterval(id)
  }, [])

  if (isOpen === null) return null

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isOpen ? 'bg-green-500/15 text-green-600' : 'bg-muted text-muted-foreground'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-green-500' : 'bg-muted-foreground'}`}
        aria-hidden="true"
      />
      {isOpen ? 'Ouvert maintenant' : `Fermé — réouvre à ${SHOP_INFO.openTime}`}
    </span>
  )
}
