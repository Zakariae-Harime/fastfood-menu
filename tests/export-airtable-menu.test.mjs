import test from 'node:test'
import assert from 'node:assert/strict'
import { stat } from 'node:fs/promises'

const scriptUrl = new URL('../scripts/export-airtable-menu.mjs', import.meta.url)
const outputUrl = new URL('../docs/airtable-menu-template.csv', import.meta.url)
const beforeImport = await stat(outputUrl)
const { validateMenuItem } = await import(`${scriptUrl.href}?test=${Date.now()}`)
const afterImport = await stat(outputUrl)

test('importing validation helpers does not regenerate the CSV', () => {
  assert.equal(afterImport.mtimeMs, beforeImport.mtimeMs)
})

test('reports missing menu names separately from id validation', () => {
  assert.throws(
    () => validateMenuItem({ id: 'pizza-test', name_fr: '', name_darija: 'بيتزا' }, new Set()),
    { message: 'Missing required menu name for id: pizza-test' },
  )
})
