'use client'

import useSWR from 'swr'
import { LOCAL_MENU_URL, REMOTE_MENU_URL } from '@/lib/config'
import type { MenuItem } from '@/lib/types'

async function fetchMenu(): Promise<MenuItem[]> {
  // Try the remote (e.g. Google Sheets published-as-JSON) endpoint first,
  // then fall back to the local JSON bundled with the site.
  if (REMOTE_MENU_URL) {
    try {
      const res = await fetch(REMOTE_MENU_URL)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) return data as MenuItem[]
      }
    } catch {
      // fall through to local fallback
    }
  }
  const res = await fetch(LOCAL_MENU_URL)
  if (!res.ok) throw new Error('Impossible de charger le menu')
  return (await res.json()) as MenuItem[]
}

export function useMenu() {
  const { data, error, isLoading } = useSWR<MenuItem[]>('menu', fetchMenu, {
    revalidateOnFocus: false,
  })
  return {
    items: (data ?? []).filter((item) => item.available),
    error,
    isLoading,
  }
}
