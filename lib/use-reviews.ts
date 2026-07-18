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
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  return data ?? []
}
