import { MENU_CATEGORIES, type Ingredient, type MenuExtra, type MenuItem } from './types'

const categories = new Set<string>(MENU_CATEGORIES)
const text = (value: unknown) => String(value ?? '').trim()
const number = (value: unknown) => {
  const normalized = text(value)
  return normalized ? Number(normalized) : Number.NaN
}
const bool = (value: unknown) =>
  typeof value === 'boolean' ? value : text(value).toUpperCase() === 'TRUE'

function ingredients(value: unknown): Ingredient[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => ({
        name: text(typeof entry === 'string' ? entry : entry?.name),
        name_darija: text(
          typeof entry === 'string' ? entry : (entry?.name_darija ?? entry?.name),
        ),
      }))
      .filter((entry) => entry.name && entry.name_darija)
  }

  return text(value)
    .split(/\r?\n|,/)
    .map((line) => {
      const [name, darija] = line.split('|').map((part) => part.trim())
      return { name, name_darija: darija || name }
    })
    .filter((entry) => entry.name && entry.name_darija)
}

function extras(value: unknown): MenuExtra[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => ({
        name: text(entry?.name),
        name_darija: text(entry?.name_darija ?? entry?.name),
        price: number(entry?.price),
      }))
      .filter(
        (entry) =>
          entry.name && entry.name_darija && Number.isFinite(entry.price) && entry.price >= 0,
      )
  }

  return text(value)
    .split(/\r?\n|;/)
    .map((line) => {
      if (line.includes('|')) {
        const [name, name_darija, price] = line.split('|').map((part) => part.trim())
        return { name, name_darija: name_darija || name, price: number(price) }
      }
      const [name, price] = line.split(':').map((part) => part.trim())
      return { name, name_darija: name, price: number(price) }
    })
    .filter(
      (entry) =>
        entry.name && entry.name_darija && Number.isFinite(entry.price) && entry.price >= 0,
    )
}

export function normalizeMenuRecord(raw: unknown): MenuItem | null {
  if (!raw || typeof raw !== 'object') return null

  const record = raw as Record<string, unknown>
  const id = text(record.id)
  const name_fr = text(record.name_fr)
  const name_darija = text(record.name_darija)
  const base_price = number(record.base_price)

  if (
    !id ||
    !name_fr ||
    !name_darija ||
    !categories.has(text(record.category)) ||
    !Number.isFinite(base_price) ||
    base_price < 0
  ) {
    return null
  }

  return {
    id,
    name_fr,
    name_darija,
    category: text(record.category) as MenuItem['category'],
    base_price,
    bread_options: ingredients(record.bread_options),
    included: ingredients(record.included),
    extras: extras(record.extras),
    available: bool(record.available),
    featured: bool(record.featured),
    image: text(record.image) || undefined,
  }
}

export function normalizeMenuRecords(raw: unknown): MenuItem[] {
  if (!Array.isArray(raw)) return []

  const seen = new Set<string>()
  return raw.flatMap((record) => {
    const item = normalizeMenuRecord(record)
    if (!item || seen.has(item.id)) return []
    seen.add(item.id)
    return [item]
  })
}
