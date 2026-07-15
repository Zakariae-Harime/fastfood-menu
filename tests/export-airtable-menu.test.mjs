import test from 'node:test'
import assert from 'node:assert/strict'

const { validateMenuItem } = await import('../scripts/export-airtable-menu.mjs')

test('reports missing menu names separately from id validation', () => {
  assert.throws(
    () => validateMenuItem({ id: 'pizza-test', name_fr: '', name_darija: 'بيتزا' }, new Set()),
    { message: 'Missing required menu name for id: pizza-test' },
  )
})
