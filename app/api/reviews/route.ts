import { NextResponse } from 'next/server'
import { normalizeReviews } from '@/lib/reviews'

// Reviews are edited infrequently and fetched by the client every five minutes.
// Keep this route dynamic so an empty or old Airtable response is never stored
// in Next.js's route/data cache across deployments.
export const dynamic = 'force-dynamic'

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
      cache: 'no-store',
    })
    if (!response.ok) throw new Error(`Airtable responded ${response.status}`)

    const data = (await response.json()) as { records?: AirtableRecord[] }
    const records = (data.records ?? []).map((record) => ({
      id: record.id,
      ...record.fields,
    }))

    return NextResponse.json(normalizeReviews(records), {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch {
    console.warn('[reviews] Airtable unavailable; hiding customer reviews')
    return NextResponse.json([])
  }
}
