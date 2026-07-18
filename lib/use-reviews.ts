'use client'

import useSWR from 'swr'
import { normalizeReviews, type CustomerReview } from '@/lib/reviews'

async function fetchReviews(url: string): Promise<CustomerReview[]> {
  try {
    const response = await fetch(url)
    if (!response.ok) return []
    return normalizeReviews(await response.json())
  } catch {
    return []
  }
}

export function useReviews() {
  const { data } = useSWR('/api/reviews', fetchReviews, {
    refreshInterval: 300_000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
  })

  return data ?? []
}
