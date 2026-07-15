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

if (!Array.isArray(menu)) throw new Error('Menu data must be an array')

const rows = menu.map((item) => {
  const id = typeof item.id === 'string' ? item.id.trim() : ''
  if (!id || !item.name_fr || !item.name_darija || ids.has(id)) {
    throw new Error(`Invalid or duplicate menu id: ${item.id}`)
  }
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
