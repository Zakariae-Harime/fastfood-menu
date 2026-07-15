# Mobile Menu and Homepage Grids Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the mobile menu and the homepage specialties and values grids without changing Snack Maestro's existing identity or ordering behavior.

**Architecture:** Keep state and data flow in the existing components. Change only responsive presentation: `MenuClient` owns the sticky search/category controls, `MenuItemCard` owns optimized item presentation, `SpecialtiesGrid` switches between a mobile snap rail and wider grid, and the homepage values mapping gains responsive span rules.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5.7, Tailwind CSS 4, Lucide React, Node's built-in test runner

## Global Constraints

- Preserve the existing CSS color custom properties, Inter/Archivo typography, Darija font, bilingual copy, RTL support, cart state, customize sheet, and WhatsApp order flow.
- Primary target is 375–430 px; also verify 768 px, 1024 px, and 1440 px.
- Maintain 44-pixel minimum touch targets, visible focus, meaningful image alt text, semantic DOM order, and reduced-motion behavior.
- Only the category chips and specialties rail may scroll horizontally; the page itself must not overflow.
- Keep tablet and desktop layouts familiar.

---

### Task 1: Mobile menu navigation and cards

**Files:**
- Create: `tests/mobile-ui.test.mjs`
- Modify: `components/menu-client.tsx`
- Modify: `components/menu-item-card.tsx`

**Interfaces:**
- Consumes: existing `MenuCategory`, `MenuItem`, `useMenu`, `useLanguage`, and `onCustomize(item: MenuItem): void` interfaces.
- Produces: the same public `MenuClient()` and `MenuItemCard({ item, onCustomize })` component interfaces; no downstream API changes.

- [ ] **Step 1: Write failing structural tests**

Create `tests/mobile-ui.test.mjs` with Node assertions that read the source files and require `next/image`, a mobile category-chip rail, responsive image sizing, and a compact mobile card action.

```js
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
```

- [ ] **Step 2: Run the tests and confirm RED**

Run: `node --test tests/mobile-ui.test.mjs`

Expected: failures because the dropdown marker remains and `MenuItemCard` uses a native `img`.

- [ ] **Step 3: Implement the mobile category rail**

In `components/menu-client.tsx`, remove the dropdown state, `ChevronDown`, and `LayoutGrid`. Render one horizontal `nav` at all sizes with scroll snapping, `aria-pressed`, 44-pixel controls, and the existing `selectCategory` behavior. Tighten header padding and keep search available above the chips.

- [ ] **Step 4: Implement compact optimized menu cards**

In `components/menu-item-card.tsx`, import `Image` from `next/image`, render a 112–144 px responsive image column using explicit `width`, `height`, and `sizes`, preserve the colored rail fallback, tighten spacing, strengthen the price badge, and keep the full-width customize/add button.

- [ ] **Step 5: Run tests and confirm GREEN**

Run: `node --test tests/mobile-ui.test.mjs`

Expected: 2 tests pass, 0 fail.

- [ ] **Step 6: Commit the menu change**

```bash
git add tests/mobile-ui.test.mjs components/menu-client.tsx components/menu-item-card.tsx
git commit -m "feat: improve mobile menu browsing"
```

### Task 2: Homepage specialties rail and values grid

**Files:**
- Modify: `tests/mobile-ui.test.mjs`
- Modify: `components/specialties-grid.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: existing `useMenu().featured`, `formatPrice`, `ScrollReveal`, `VALUES`, and translation keys.
- Produces: unchanged `SpecialtiesGrid()` and `HomePage()` public component interfaces.

- [ ] **Step 1: Add failing homepage layout tests**

Append tests requiring a snap rail with a visible next-card cue, `next/image`, and a third values tile that spans both mobile columns.

```js
test('specialties use a mobile snap rail and optimized images', async () => {
  const source = await read('components/specialties-grid.tsx')
  assert.match(source, /snap-x/)
  assert.match(source, /basis-\[84%\]/)
  assert.match(source, /import Image from 'next\/image'/)
})

test('the third value spans the mobile values grid', async () => {
  const source = await read('app/page.tsx')
  assert.match(source, /grid-cols-2/)
  assert.match(source, /index === 2 \? 'col-span-2'/)
})
```

- [ ] **Step 2: Run the tests and confirm RED**

Run: `node --test tests/mobile-ui.test.mjs`

Expected: the two new tests fail because both homepage sections still use stacked mobile cards.

- [ ] **Step 3: Implement the specialties snap rail**

In `components/specialties-grid.tsx`, use a mobile horizontal flex rail with `snap-x`, cards at `basis-[84%]`, and negative edge compensation so the rail aligns with the section container. Switch to the existing three-column grid at `sm`. Use `next/image` with explicit dimensions and responsive `sizes`; align skeletons to the same geometry.

- [ ] **Step 4: Implement the values grid**

In `app/page.tsx`, render the values list as a two-column mobile grid. Apply `col-span-2` to index 2 and reset every tile to one column at `sm`, with compact padding and left-aligned mobile content that returns to centered alignment on wider screens.

- [ ] **Step 5: Run tests and confirm GREEN**

Run: `node --test tests/mobile-ui.test.mjs`

Expected: 4 tests pass, 0 fail.

- [ ] **Step 6: Commit the homepage change**

```bash
git add tests/mobile-ui.test.mjs components/specialties-grid.tsx app/page.tsx
git commit -m "feat: refine mobile homepage grids"
```

### Task 3: Responsive and production verification

**Files:**
- Modify only if verification exposes a focused defect in files already listed above.

**Interfaces:**
- Consumes: completed menu and homepage components.
- Produces: a verified build with no interface changes.

- [ ] **Step 1: Run focused tests**

Run: `node --test tests/mobile-ui.test.mjs`

Expected: 4 tests pass, 0 fail.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: exit code 0 with no ESLint errors.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: exit code 0 and successful generation of `/`, `/menu`, `/qr`, and `/api/menu`.

- [ ] **Step 4: Inspect the final diff**

Run: `git diff --check` and `git status --short`

Expected: no whitespace errors; only the approved implementation and plan files are present.

- [ ] **Step 5: Commit any verification-only correction**

If verification required a focused correction, stage only the corrected approved files and commit with `git commit -m "fix: polish responsive menu layout"`. If no correction was needed, do not create an empty commit.
