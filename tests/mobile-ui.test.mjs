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
  assert.match(source, /min-h-11/)
  assert.match(source, /self-stretch/)
})

test('specialties use a mobile snap rail and optimized images', async () => {
  const source = await read('components/specialties-grid.tsx')
  assert.match(source, /grid gap-4/)
  assert.doesNotMatch(source, /overflow-x-auto/)
  assert.match(source, /import Image from 'next\/image'/)
})

test('the third value spans the mobile values grid', async () => {
  const source = await read('app/page.tsx')
  assert.match(source, /grid-cols-2/)
  assert.match(source, /index === 2 \? 'col-span-2'/)
})
