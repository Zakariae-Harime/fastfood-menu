import { NextResponse } from 'next/server'
import { normalizeReviews } from '@/lib/reviews'

export const revalidate = 300

const AIRTABLE_TABLE_NAME = 'Reviews'

interface AirtableRecord {
  id: string
  fields?: Record<string, unknown>
}

export async function GET() {
  const token = process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID

  if (!token || !baseId) return NextResponse.json([])

  try {
    const url = new URL(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
    )
    url.searchParams.set('filterByFormula', '{featured}=TRUE()')
    url.searchParams.set('sort[0][field]', 'date')
    url.searchParams.set('sort[0][direction]', 'desc')
    url.searchParams.set('maxRecords', '6')
    url.searchParams.set('pageSize', '6')

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    })
    if (!response.ok) throw new Error(`Airtable responded ${response.status}`)

    const data = (await response.json()) as { records?: AirtableRecord[] }
    const records = (data.records ?? []).map((record) => ({
      id: record.id,
      ...record.fields,
    }))

    return NextResponse.json(normalizeReviews(records))
  } catch {
    console.warn('[reviews] Airtable unavailable; hiding customer reviews')
    return NextResponse.json([])
  }
}
