export interface CustomerReview {
  id: string
  reviewerName: string
  rating: number
  text: string
  date: string
}

type ReviewRecord = Record<string, unknown>

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export function normalizeReview(record: ReviewRecord): CustomerReview | null {
  const reviewerName = cleanText(record.reviewer_name)
  const text = cleanText(record.text)
  const date = cleanText(record.date)
  const rawRating = typeof record.rating === 'number' ? record.rating : Number(record.rating)

  if (!reviewerName || !text || !date || !Number.isFinite(rawRating)) return null

  return {
    id: cleanText(record.id) || `${reviewerName}-${date}`,
    reviewerName,
    rating: Math.min(5, Math.max(1, Math.round(rawRating))),
    text,
    date,
  }
}

export function normalizeReviews(records: unknown): CustomerReview[] {
  if (!Array.isArray(records)) return []

  return records
    .map((record) =>
      record && typeof record === 'object'
        ? normalizeReview(record as ReviewRecord)
        : null,
    )
    .filter((review): review is CustomerReview => review !== null)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 6)
}
