import { NextResponse } from 'next/server'

// Cache Airtable responses at the server/edge for 5 minutes. This is the
// real lever against Airtable's free-tier limit of 1,000 API calls/month:
// at 30s, steady scan traffic across an 11am-2am day could burn through
// that budget in days. At 5 minutes, worst case is ~288 calls/day even
// under constant traffic — comfortably inside the free plan. Menu edits
// still go live same-day, just not within a literal minute.
export const revalidate = 300

const AIRTABLE_TABLE_NAME = 'Menu'

export async function GET() {
  const token = process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID

  if (!token || !baseId) {
    return NextResponse.json(
      { error: 'AIRTABLE_TOKEN or AIRTABLE_BASE_ID not configured' },
      { status: 500 },
    )
  }

  try {
    const items: any[] = []
    let offset: string | undefined

    do {
      const url = new URL(
        `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
      )
      if (offset) url.searchParams.set('offset', offset)

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 },
      })
      if (!res.ok) throw new Error(`Airtable responded ${res.status}`)

      const data = await res.json()
      // Flatten Airtable's { id, fields: {...} } record shape into a plain
      // object so the existing normalize() logic in lib/use-menu.ts (which
      // already handles both arrays and comma/semicolon strings) works
      // completely unchanged. The row's own "id" field (if filled in)
      // wins over Airtable's internal record id.
      items.push(...data.records.map((r: any) => ({ id: r.id, ...r.fields })))
      offset = data.offset
    } while (offset)

    return NextResponse.json(items)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch Airtable menu' }, { status: 502 })
  }
}
