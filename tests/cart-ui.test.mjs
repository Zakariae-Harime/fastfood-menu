import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('cart drawer has compact sheet zones and focus recovery', async () => {
  const source = await read('components/cart-drawer.tsx')
  assert.match(source, /CartLineItem/)
  assert.match(source, /CartCustomerDetails/)
  assert.match(source, /max-h-\[88dvh\]/)
  assert.match(source, /safe-area-inset-bottom/)
  assert.match(source, /event\.key === 'Escape'/)
  assert.match(source, /cartButtonRef/)
  assert.match(source, /closeButtonRef/)
  assert.match(source, /requestAnimationFrame/)
})

test('fixed cart header shows a localized item count', async () => {
  const drawer = await read('components/cart-drawer.tsx')
  const messages = await read('lib/language-context.tsx')
  assert.match(drawer, /t\('cart\.itemCount', \{ count: itemCount \}\)/)
  assert.match(drawer, /aria-live="polite"/)
  assert.match(messages, /'cart\.itemCount': '[^']*\{count\}[^']*'/)
})

test('special request is an accessible disclosure', async () => {
  const source = await read('components/cart-customer-details.tsx')
  assert.match(source, /aria-expanded=\{noteOpen\}/)
  assert.match(source, /aria-controls="cart-note-fields"/)
  assert.match(source, /rows=\{2\}/)
  assert.match(source, /role="radiogroup"/)
  assert.match(source, /role="radio"/)
})

test('cart line controls meet the mobile touch target', async () => {
  const source = await read('components/cart-line-item.tsx')
  assert.match(source, /min-h-11/)
  assert.match(source, /min-w-11/)
  assert.match(source, /lineSubtotal\(line\)/)
})
