import { readFile, writeFile } from 'node:fs/promises'

const input = new URL('../public/data/menu.json', import.meta.url)
const output = new URL('../docs/airtable-menu-template.csv', import.meta.url)
const menu = JSON.parse(await readFile(input, 'utf8'))
const columns = [
  'id',
  'name_fr',
  'name_darija',
  'category',
  'base_price',
  'available',
  'featured',
  'image',
  'included',
  'bread_options',
  'extras',
]
const ids = new Set()
const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
const bilingual = (items = []) =>
  items.map((item) => `${item.name} | ${item.name_darija}`).join('\n')
const extras = (items = []) =>
  items.map((item) => `${item.name} | ${item.name_darija} | ${item.price}`).join('\n')

export function validateMenuItem(item, existingIds) {
  const id = typeof item.id === 'string' ? item.id.trim() : ''
  if (!id) throw new Error(`Invalid menu id: ${item.id}`)
  if (existingIds.has(id)) throw new Error(`Duplicate menu id: ${id}`)
  if (!String(item.name_fr ?? '').trim() || !String(item.name_darija ?? '').trim()) {
    throw new Error(`Missing required menu name for id: ${id}`)
  }
  return id
}

if (!Array.isArray(menu)) throw new Error('Menu data must be an array')

const rows = menu.map((item) => {
  const id = validateMenuItem(item, ids)
  ids.add(id)
  const record = {
    ...item,
    id,
    included: bilingual(item.included),
    bread_options: bilingual(item.bread_options),
    extras: extras(item.extras),
  }
  return columns.map((column) => quote(record[column])).join(',')
})

await writeFile(output, `${columns.map(quote).join(',')}\n${rows.join('\n')}\n`, 'utf8')
console.log(`Wrote ${rows.length} Airtable menu rows`)
