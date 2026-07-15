# Airtable Menu and Compact Cart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the lightweight Airtable menu workflow and replace the cramped mobile cart with a compact, accessible bottom sheet.

**Architecture:** Airtable remains a read-only server-side menu source behind `/api/menu`, with pure normalization shared by server and client fallback and `menu.json` as the safety net. The cart keeps its existing state and WhatsApp behavior but splits item rows and customer details into focused components inside a header/body/footer sheet layout.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.7, SWR, Airtable Web API, Tailwind CSS 4, Node test runner

## Global Constraints

- Airtable itself is the owner dashboard; do not build a website admin page.
- Do not track WhatsApp clicks, messages, delivery status, or completed orders.
- Preserve the existing palette, typography, bilingual French/Darija experience, RTL behavior, customization flow, cart calculations, and WhatsApp message format.
- Keep `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID` server-only and restrict the Airtable token to `data.records:read` for the selected base.
- Keep the five-minute menu cache and fall back to `public/data/menu.json` whenever Airtable cannot produce at least one valid menu record.
- Primary cart target is a 375–430 px mobile viewport with 44-pixel controls and safe-area padding.

---

### Task 1: Shared menu normalization and Airtable fallback

**Files:**
- Create: `lib/menu-normalize.ts`
- Create: `tests/menu-normalize.test.mjs`
- Modify: `lib/use-menu.ts`
- Modify: `app/api/menu/route.ts`

**Interfaces:**
- Consumes: `MENU_CATEGORIES`, `MenuCategory`, `MenuItem`, `Ingredient`, and `MenuExtra` from `lib/types.ts`.
- Produces: `normalizeMenuRecord(raw: unknown): MenuItem | null` and `normalizeMenuRecords(raw: unknown): MenuItem[]`.

- [ ] **Step 1: Write the failing normalization tests**

Create a TypeScript-loading hook inside `tests/menu-normalize.test.mjs`, then assert bilingual line parsing, legacy local arrays, invalid-row rejection, and first-record deduplication:

```js
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
    id: 'tacos-test', name_fr: 'Tacos test', name_darija: 'تاكوس',
    category: 'Tacos', base_price: 40, available: true,
    included: 'Poulet | دجاج\nFrites | فريت',
    bread_options: 'Taille L | حجم L',
    extras: 'Fromage | فرماج | 5\nMenu | مينيو | 12',
  })
  assert.deepEqual(item.included[0], { name: 'Poulet', name_darija: 'دجاج' })
  assert.deepEqual(item.bread_options[0], { name: 'Taille L', name_darija: 'حجم L' })
  assert.deepEqual(item.extras[1], { name: 'Menu', name_darija: 'مينيو', price: 12 })
})

test('rejects invalid rows and keeps the first duplicate id', () => {
  const items = normalizeMenuRecords([
    { id: 'valid', name_fr: 'Premier', name_darija: 'الأول', category: 'Pizza', base_price: 20, available: true },
    { id: 'valid', name_fr: 'Second', name_darija: 'الثاني', category: 'Pizza', base_price: 30, available: true },
    { id: 'bad-category', name_fr: 'Bad', name_darija: 'خطأ', category: 'Unknown', base_price: 20, available: true },
    { id: 'bad-price', name_fr: 'Bad', name_darija: 'خطأ', category: 'Pizza', base_price: -1, available: true },
  ])
  assert.equal(items.length, 1)
  assert.equal(items[0].name_fr, 'Premier')
})
```

- [ ] **Step 2: Run the normalization tests and confirm RED**

Run: `node --test tests/menu-normalize.test.mjs`

Expected: FAIL because `lib/menu-normalize.ts` does not exist.

- [ ] **Step 3: Implement pure normalization**

Create `lib/menu-normalize.ts` with:

```ts
import { MENU_CATEGORIES, type Ingredient, type MenuExtra, type MenuItem } from './types'

const categories = new Set<string>(MENU_CATEGORIES)
const text = (value: unknown) => String(value ?? '').trim()
const number = (value: unknown) => typeof value === 'number' ? value : Number(text(value))
const bool = (value: unknown) => typeof value === 'boolean' ? value : text(value).toUpperCase() === 'TRUE'

function ingredients(value: unknown): Ingredient[] {
  if (Array.isArray(value)) return value.map((entry) => ({
    name: text(typeof entry === 'string' ? entry : entry?.name),
    name_darija: text(typeof entry === 'string' ? entry : entry?.name_darija ?? entry?.name),
  })).filter((entry) => entry.name && entry.name_darija)
  return text(value).split(/\r?\n|,/).map((line) => {
    const [name, darija] = line.split('|').map((part) => part.trim())
    return { name, name_darija: darija || name }
  }).filter((entry) => entry.name && entry.name_darija)
}

function extras(value: unknown): MenuExtra[] {
  if (Array.isArray(value)) return value.map((entry) => ({
    name: text(entry?.name), name_darija: text(entry?.name_darija ?? entry?.name), price: number(entry?.price),
  })).filter((entry) => entry.name && entry.name_darija && Number.isFinite(entry.price) && entry.price >= 0)
  return text(value).split(/\r?\n|;/).map((line) => {
    if (line.includes('|')) {
      const [name, name_darija, price] = line.split('|').map((part) => part.trim())
      return { name, name_darija: name_darija || name, price: number(price) }
    }
    const [name, price] = line.split(':').map((part) => part.trim())
    return { name, name_darija: name, price: number(price) }
  }).filter((entry) => entry.name && entry.name_darija && Number.isFinite(entry.price) && entry.price >= 0)
}

export function normalizeMenuRecord(raw: any): MenuItem | null {
  const id = text(raw?.id)
  const name_fr = text(raw?.name_fr)
  const name_darija = text(raw?.name_darija)
  const base_price = number(raw?.base_price)
  if (!id || !name_fr || !name_darija || !categories.has(raw?.category) || !Number.isFinite(base_price) || base_price < 0) return null
  return { id, name_fr, name_darija, category: raw.category, base_price,
    bread_options: ingredients(raw.bread_options), included: ingredients(raw.included), extras: extras(raw.extras),
    available: bool(raw.available), featured: bool(raw.featured), image: text(raw.image) || undefined }
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
```

- [ ] **Step 4: Use the shared normalizer in the client and API**

Replace normalization helpers in `lib/use-menu.ts` with `normalizeMenuRecords`. In `app/api/menu/route.ts`, normalize flattened Airtable records before returning them, fall back when the normalized array is empty, and log only `console.warn('[menu] Airtable unavailable; using local fallback')` from the catch path.

- [ ] **Step 5: Run normalization and existing UI tests**

Run: `node --test tests/menu-normalize.test.mjs tests/mobile-ui.test.mjs`

Expected: all tests pass.

- [ ] **Step 6: Commit the Airtable data path**

```bash
git add lib/menu-normalize.ts tests/menu-normalize.test.mjs lib/use-menu.ts app/api/menu/route.ts
git commit -m "feat: harden Airtable menu loading"
```

### Task 2: Owner setup guide and Airtable import template

**Files:**
- Create: `scripts/export-airtable-menu.mjs`
- Create: `docs/airtable-menu-setup.md`
- Generate: `docs/airtable-menu-template.csv`

**Interfaces:**
- Consumes: `public/data/menu.json` and the field format implemented in Task 1.
- Produces: an importable CSV with columns `id,name_fr,name_darija,category,base_price,available,featured,image,included,bread_options,extras`.

- [ ] **Step 1: Add the deterministic CSV exporter**

Create `scripts/export-airtable-menu.mjs`:

```js
import { readFile, writeFile } from 'node:fs/promises'

const input = new URL('../public/data/menu.json', import.meta.url)
const output = new URL('../docs/airtable-menu-template.csv', import.meta.url)
const menu = JSON.parse(await readFile(input, 'utf8'))
const columns = ['id', 'name_fr', 'name_darija', 'category', 'base_price', 'available', 'featured', 'image', 'included', 'bread_options', 'extras']
const ids = new Set()
const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
const bilingual = (items = []) => items.map((item) => `${item.name} | ${item.name_darija}`).join('\n')
const extras = (items = []) => items.map((item) => `${item.name} | ${item.name_darija} | ${item.price}`).join('\n')

const rows = menu.map((item) => {
  if (!item.id || !item.name_fr || !item.name_darija || ids.has(item.id)) throw new Error(`Invalid or duplicate menu id: ${item.id}`)
  ids.add(item.id)
  const record = { ...item, included: bilingual(item.included), bread_options: bilingual(item.bread_options), extras: extras(item.extras) }
  return columns.map((column) => quote(record[column])).join(',')
})

await writeFile(output, `${columns.map(quote).join(',')}\n${rows.join('\n')}\n`, 'utf8')
console.log(`Wrote ${rows.length} Airtable menu rows`)
```

- [ ] **Step 2: Generate and validate the template**

Run: `node scripts/export-airtable-menu.mjs`

Expected: `docs/airtable-menu-template.csv` contains one header plus one row per local menu item.

- [ ] **Step 3: Write the owner setup guide**

Create `docs/airtable-menu-setup.md` with these exact sections and instructions:

```markdown
# Airtable menu setup

## 1. Import the menu
Create a base, import `airtable-menu-template.csv`, and name the table `Menu`.

## 2. Set field types
Use single-line text for ids and names, single select for category, number for base price, checkboxes for available/featured, URL for image, and long text for included/bread_options/extras.

## 3. Create owner views
Create Menu complet, Disponibles, Indisponibles, and À la une using the documented filters.

## 4. Connect Vercel
Create a personal access token restricted to this base with `data.records:read`. Add `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID` to Vercel. Never paste the token into source code.

## 5. Daily editing
Uncheck available instead of deleting an item. Changes can take up to five minutes to appear. Use `French | Darija` per option line and `French | Darija | price` per extra line.
```

- [ ] **Step 4: Commit the owner workflow**

```bash
git add scripts/export-airtable-menu.mjs docs/airtable-menu-setup.md docs/airtable-menu-template.csv
git commit -m "docs: add Airtable menu setup kit"
```

### Task 3: Compact cart components and sheet behavior

**Files:**
- Create: `components/cart-line-item.tsx`
- Create: `components/cart-customer-details.tsx`
- Create: `tests/cart-ui.test.mjs`
- Modify: `components/cart-drawer.tsx`
- Modify: `lib/language-context.tsx`

**Interfaces:**
- `CartLineItem({ line, onQuantityChange, onRemove })` consumes one `CartLine` and callbacks.
- `CartCustomerDetails({ customerName, customerNote, mode, onNameChange, onNoteChange, onModeChange })` consumes controlled checkout fields.
- `CartDrawer()` keeps its public interface unchanged.

- [ ] **Step 1: Write failing cart structure tests**

Create `tests/cart-ui.test.mjs` with source assertions for the split components, note disclosure, Escape handling, focus refs, safe-area footer, and `max-h-[88dvh]` sheet geometry.

```js
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
  assert.match(source, /event.key === 'Escape'/)
  assert.match(source, /cartButtonRef/)
})

test('special request is an accessible disclosure', async () => {
  const source = await read('components/cart-customer-details.tsx')
  assert.match(source, /aria-expanded=\{noteOpen\}/)
  assert.match(source, /aria-controls="cart-note-fields"/)
  assert.match(source, /rows=\{2\}/)
})
```

- [ ] **Step 2: Run the cart tests and confirm RED**

Run: `node --test tests/cart-ui.test.mjs`

Expected: FAIL because the focused cart components do not exist.

- [ ] **Step 3: Extract the cart line item**

Create `components/cart-line-item.tsx` with this public shape and move the existing item name, selected options, quantity controls, line price, and remove control into it:

```tsx
interface CartLineItemProps {
  line: CartLine
  onQuantityChange: (uid: string, quantity: number) => void
  onRemove: (uid: string) => void
}

export function CartLineItem({ line, onQuantityChange, onRemove }: CartLineItemProps) {
  // Derive translated name, removed ingredients, and added ingredients exactly as CartDrawer currently does.
  // Render a rounded border card with p-3, 44px remove/quantity buttons, and formatPrice(lineSubtotal(line)).
}
```

- [ ] **Step 4: Build the controlled customer-details disclosure**

Create `components/cart-customer-details.tsx` around this controlled interface and disclosure logic:

```tsx
interface CartCustomerDetailsProps {
  customerName: string
  customerNote: string
  mode: 'sur-place' | 'a-emporter'
  onNameChange: (value: string) => void
  onNoteChange: (value: string) => void
  onModeChange: (value: 'sur-place' | 'a-emporter') => void
}

export function CartCustomerDetails(props: CartCustomerDetailsProps) {
  const { t } = useLanguage()
  const [noteOpen, setNoteOpen] = useState(props.customerNote.length > 0)
  return <div className="flex flex-col gap-3">
    {/* Existing controlled name input and order-mode radiogroup */}
    <button type="button" aria-expanded={noteOpen} aria-controls="cart-note-fields" onClick={() => setNoteOpen((open) => !open)} className="min-h-11 text-start font-semibold">
      {t(noteOpen ? 'cart.hideNote' : 'cart.addNote')}
    </button>
    {noteOpen ? <div id="cart-note-fields"><textarea value={props.customerNote} onChange={(event) => props.onNoteChange(event.target.value)} rows={2} maxLength={300} /></div> : null}
  </div>
}
```

- [ ] **Step 5: Recompose the cart drawer**

Use `useRef` for the floating and close buttons and implement the close/focus behavior exactly as follows:

```tsx
const cartButtonRef = useRef<HTMLButtonElement>(null)
const closeButtonRef = useRef<HTMLButtonElement>(null)
const closeCart = useCallback(() => {
  setOpen(false)
  requestAnimationFrame(() => cartButtonRef.current?.focus())
}, [])

useEffect(() => {
  if (!open) return
  closeButtonRef.current?.focus()
  const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') closeCart() }
  window.addEventListener('keydown', onKeyDown)
  return () => window.removeEventListener('keydown', onKeyDown)
}, [open, closeCart])
```

Render a `max-h-[88dvh]` flex sheet with a shrink-0 header, one `overflow-y-auto` body containing `CartLineItem` rows and `CartCustomerDetails`, and this shrink-0 footer shape:

```tsx
<div className="shrink-0 border-t border-border px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
  <div className="mb-3 flex items-center justify-between">{/* total label and value */}</div>
  <button type="button" onClick={handleOrder} className="flex min-h-14 w-full items-center justify-center rounded-full bg-whatsapp font-bold text-whatsapp-foreground">{/* icon and label */}</button>
</div>
```

- [ ] **Step 6: Add bilingual disclosure copy**

Add these exact message entries:

```ts
// French
'cart.addNote': 'Ajouter une demande spéciale',
'cart.hideNote': 'Masquer la demande spéciale',

// Darija
'cart.addNote': 'زيد ملاحظة للطلب',
'cart.hideNote': 'خبي ملاحظة الطلب',
```

- [ ] **Step 7: Run cart and regression tests**

Run: `node --test tests/cart-ui.test.mjs tests/menu-normalize.test.mjs tests/mobile-ui.test.mjs`

Expected: all tests pass.

- [ ] **Step 8: Commit the compact cart**

```bash
git add components/cart-drawer.tsx components/cart-line-item.tsx components/cart-customer-details.tsx lib/language-context.tsx tests/cart-ui.test.mjs
git commit -m "feat: compact the mobile cart sheet"
```

### Task 4: Production verification

**Files:**
- Modify only if verification exposes a focused defect in files already listed above.

**Interfaces:**
- Consumes: the completed Airtable and cart implementation.
- Produces: a clean verified repository with no additional public API changes.

- [ ] **Step 1: Run all focused tests**

Run: `node --test tests/menu-normalize.test.mjs tests/cart-ui.test.mjs tests/mobile-ui.test.mjs`

Expected: all tests pass with zero failures.

- [ ] **Step 2: Run TypeScript validation without updating the build cache**

Run: `npx tsc --noEmit --incremental false`

Expected: exit code 0 with no diagnostics.

- [ ] **Step 3: Run the production build**

Run: `npm run build`

Expected: successful compilation and generation of `/`, `/menu`, `/qr`, and `/api/menu`.

- [ ] **Step 4: Record the known lint limitation**

Run: `npm run lint`

Expected current repository result: command cannot start because ESLint is not declared. Do not add unrelated lint dependencies in this feature.

- [ ] **Step 5: Inspect repository cleanliness**

Remove only generated verification artifacts, then run `git diff --check` and `git status --short`.

Expected: no whitespace errors and no uncommitted files.
