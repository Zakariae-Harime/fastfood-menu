import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('menu uses a mobile horizontal category rail', async () => {
  const source = await read('components/menu-client.tsx')
  assert.match(source, /overflow-x-auto/)
  assert.match(source, /aria-pressed=\{activeCategory === category\}/)
  assert.doesNotMatch(source, /mobile-menu-categories/)
})

test('menu cards use optimized responsive images and compact actions', async () => {
  const source = await read('components/menu-item-card.tsx')
  assert.match(source, /import Image from 'next\/image'/)
  assert.match(source, /sizes="\(max-width: 399px\) 112px/)
  assert.match(source, /min-h-11/)
})
