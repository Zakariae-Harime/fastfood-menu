'use client'

import useSWR from 'swr'
import { LOCAL_MENU_URL, REMOTE_MENU_URL } from '@/lib/config'
import type { MenuExtra, MenuItem } from '@/lib/types'

// A Google Sheet published via opensheet.elk.sh returns every cell as a
// plain string (no arrays, no booleans, no numbers). These helpers turn a
// raw sheet row into the same shape the local menu.json already uses, so
// the rest of the app never has to know which source the data came from.

function toBool(v: unknown): boolean {
  if (typeof v === 'boolean') return v
  return String(v ?? '').trim().toUpperCase() === 'TRUE'
}

function toNumber(v: unknown): number {
  if (typeof v === 'number') return v
  const n = Number(String(v ?? '').trim())
  return Number.isFinite(n) ? n : 0
}

// Comma-separated in the sheet, e.g. "Baguette, Pain rond, Panini"
function toList(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[]
  if (!v) return []
  return String(v).split(',').map((s) => s.trim()).filter(Boolean)
}

// "Fromage:5;Oeuf:3" in the sheet — name:price pairs separated by ;
function toExtras(v: unknown): MenuExtra[] {
  if (Array.isArray(v)) return v as MenuExtra[]
  if (!v) return []
  return String(v)
    .split(';')
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const [name, price] = pair.split(':')
      return { name: (name ?? '').trim(), price: toNumber(price) }
    })
}

function normalize(raw: any): MenuItem {
  return {
    id: String(raw.id ?? ''),
    name_fr: String(raw.name_fr ?? ''),
    name_darija: String(raw.name_darija ?? ''),
    category: raw.category,
    base_price: toNumber(raw.base_price),
    bread_options: toList(raw.bread_options),
    included: toList(raw.included),
    extras: toExtras(raw.extras),
    available: toBool(raw.available),
    featured: toBool(raw.featured),
    image: raw.image || undefined,
  }
}

async function fetchMenu(): Promise<MenuItem[]> {
  // Try the remote (e.g. Google Sheets published-as-JSON) endpoint first,
  // then fall back to the local JSON bundled with the site.
  if (REMOTE_MENU_URL) {
    try {
      const res = await fetch(REMOTE_MENU_URL, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) return data.map(normalize)
      }
    } catch {
      // sheet unreachable, or a typo made a row unparsable — fall through
      // to the local fallback rather than showing a broken menu
    }
  }
  const res = await fetch(LOCAL_MENU_URL)
  if (!res.ok) throw new Error('Impossible de charger le menu')
  const data = await res.json()
  return (data as any[]).map(normalize)
}

export function useMenu() {
  const { data, error, isLoading } = useSWR<MenuItem[]>('menu', fetchMenu, {
    revalidateOnFocus: false,
    refreshInterval: 60_000, // picks up owner's sheet edits within a minute, no reload needed
  })
  const available = (data ?? []).filter((item) => item.available)
  return {
    items: available,
    featured: available.filter((item) => item.featured),
    error,
    isLoading,
  }
}
