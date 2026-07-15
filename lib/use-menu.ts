'use client'

import useSWR from 'swr'
import localMenu from '@/public/data/menu.json'
import { LOCAL_MENU_URL, REMOTE_MENU_URL } from '@/lib/config'
import { normalizeMenuRecords } from '@/lib/menu-normalize'
import type { MenuItem } from '@/lib/types'

async function fetchMenu(): Promise<MenuItem[]> {
  // Try the remote endpoint first, then fall back to the local JSON bundled
  // with the site whenever it cannot produce at least one valid menu item.
  if (REMOTE_MENU_URL) {
    try {
      const res = await fetch(REMOTE_MENU_URL, { cache: 'no-store' })
      if (res.ok) {
        const items = normalizeMenuRecords(await res.json())
        if (items.length > 0) return items
      }
    } catch {
      // Remote menu unavailable; fall through to the local fallback.
    }
  }

  const res = await fetch(LOCAL_MENU_URL)
  if (!res.ok) throw new Error('Impossible de charger le menu')
  return normalizeMenuRecords(await res.json())
}

const fallbackMenu = normalizeMenuRecords(localMenu)

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
