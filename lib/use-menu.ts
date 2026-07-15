'use client'

import useSWR from 'swr'
import localMenu from '@/public/data/menu.json'
import { LOCAL_MENU_URL, REMOTE_MENU_URL } from '@/lib/config'
import type { Ingredient, MenuExtra, MenuItem } from '@/lib/types'

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

// Bread options and included ingredients can arrive as bilingual objects
// (local menu.json) or as a comma-separated French string (published sheet,
// which has no Darija column — there we mirror the French label).
function toIngredients(v: unknown): Ingredient[] {
  if (Array.isArray(v)) {
    return v.map((el) =>
      typeof el === 'string'
        ? { name: el, name_darija: el }
        : {
            name: String(el?.name ?? ''),
            name_darija: String(el?.name_darija ?? el?.name ?? ''),
          },
    )
  }
  if (!v) return []
  return String(v)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => ({ name: s, name_darija: s }))
}

// Bilingual objects locally, or "Fromage:5;Oeuf:3" name:price pairs in a sheet.
function toExtras(v: unknown): MenuExtra[] {
  if (Array.isArray(v)) {
    return v.map((el) => ({
      name: String(el?.name ?? ''),
      name_darija: String(el?.name_darija ?? el?.name ?? ''),
      price: toNumber(el?.price),
    }))
  }
  if (!v) return []
  return String(v)
    .split(';')
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const [name, price] = pair.split(':')
      const label = (name ?? '').trim()
      return { name: label, name_darija: label, price: toNumber(price) }
    })
}

function normalize(raw: any): MenuItem {
  return {
    id: String(raw.id ?? ''),
    name_fr: String(raw.name_fr ?? ''),
    name_darija: String(raw.name_darija ?? ''),
    category: raw.category,
    base_price: toNumber(raw.base_price),
    bread_options: toIngredients(raw.bread_options),
    included: toIngredients(raw.included),
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

const fallbackMenu = (localMenu as any[]).map(normalize)

export function useMenu() {
  const { data, error, isLoading } = useSWR<MenuItem[]>('menu', fetchMenu, {
    fallbackData: fallbackMenu,
    revalidateOnFocus: false,
    refreshInterval: 60_000, // picks up owner's sheet edits within a minute, no reload needed
  })
  const available = (data ?? []).filter((item) => item.available)
  return {
    items: available,
    featured: available.filter((item) => item.featured),
    error,
    isLoading: isLoading && available.length === 0,
  }
}
