import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import ts from 'typescript'

const require = createRequire(import.meta.url)
require.extensions['.ts'] = (module, filename) => {
  const source = readFileSync(filename, 'utf8')
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  module._compile(output, filename)
}

const { normalizeMenuRecord, normalizeMenuRecords } = require('../lib/menu-normalize.ts')

test('normalizes owner-friendly bilingual option lines', () => {
  const item = normalizeMenuRecord({
    id: 'tacos-test',
    name_fr: 'Tacos test',
    name_darija: 'تاكوس',
    category: 'Tacos',
    base_price: 40,
    available: true,
    included: 'Ait Benna | أيت بنا\nFrites | فريت',
    bread_options: 'Taille L | حجم L',
    extras: 'Fromage | فرماج | 5\nMenu | مينيو | 12',
  })

  assert.deepEqual(item.included[0], { name: 'Ait Benna', name_darija: 'أيت بنا' })
  assert.deepEqual(item.bread_options[0], { name: 'Taille L', name_darija: 'حجم L' })
  assert.deepEqual(item.extras[1], { name: 'Menu', name_darija: 'مينيو', price: 12 })
})

test('normalizes legacy local option arrays', () => {
  const item = normalizeMenuRecord({
    id: 'pizza-test',
    name_fr: 'Pizza test',
    name_darija: 'بيتزا',
    category: 'Pizza',
    base_price: '35',
    available: 'TRUE',
    included: [{ name: 'Olives', name_darija: 'زيتون' }],
    bread_options: ['Fine'],
    extras: [{ name: 'Fromage', name_darija: 'فرماج', price: '5' }],
  })

  assert.deepEqual(item.included, [{ name: 'Olives', name_darija: 'زيتون' }])
  assert.deepEqual(item.bread_options, [{ name: 'Fine', name_darija: 'Fine' }])
  assert.deepEqual(item.extras, [{ name: 'Fromage', name_darija: 'فرماج', price: 5 }])
})

test('rejects invalid rows and keeps the first duplicate id', () => {
  const items = normalizeMenuRecords([
    { id: 'valid', name_fr: 'Premier', name_darija: 'الأول', category: 'Pizza', base_price: 20, available: true },
    { id: 'valid', name_fr: 'Second', name_darija: 'الثاني', category: 'Pizza', base_price: 30, available: true },
    { id: 'bad-category', name_fr: 'Bad', name_darija: 'خطأ', category: 'Unknown', base_price: 20, available: true },
    { id: 'bad-price', name_fr: 'Bad', name_darija: 'خطأ', category: 'Pizza', base_price: -1, available: true },
    { id: 'missing-price', name_fr: 'Bad', name_darija: 'خطأ', category: 'Pizza', available: true },
    { id: 'blank-price', name_fr: 'Bad', name_darija: 'خطأ', category: 'Pizza', base_price: ' ', available: true },
    { id: '', name_fr: 'Bad', name_darija: 'خطأ', category: 'Pizza', base_price: 20, available: true },
  ])

  assert.equal(items.length, 1)
  assert.equal(items[0].name_fr, 'Premier')
})

test('rejects non-array record collections', () => {
  assert.deepEqual(normalizeMenuRecords({ records: [] }), [])
})
