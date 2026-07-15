# Airtable Menu and Compact Cart Design

## Goal

Give the owner a lightweight, spreadsheet-like way to maintain the menu while making the mobile cart materially easier to review and complete. Airtable itself is the owner dashboard; the website does not gain a custom admin area. WhatsApp remains the final ordering channel and orders are not tracked.

## Scope

This work has two connected deliverables:

1. Complete and harden the existing Airtable menu-data path so an owner can safely edit menu items without touching the repository.
2. Restructure the cart bottom sheet so its summary, customer details, and final action fit naturally on a 375–430 px phone viewport.

The existing palette, typography, bilingual French/Darija experience, RTL behavior, customization flow, cart calculations, and WhatsApp message format remain intact.

## Airtable as the owner dashboard

### Owner experience

The owner edits a single Airtable table named `Menu`. Airtable's normal grid view is the dashboard; no website login, authentication UI, or custom CRUD screens are introduced.

Recommended saved views:

- `Menu complet`: all records grouped by category.
- `Disponibles`: records where `available` is checked.
- `Indisponibles`: records where `available` is unchecked.
- `À la une`: records where `featured` is checked.

### Menu table fields

| Field | Airtable type | Purpose |
| --- | --- | --- |
| `id` | Single line text | Stable URL-safe identifier, such as `tacos-poulet`; required and unique. |
| `name_fr` | Single line text | French display name; required. |
| `name_darija` | Single line text | Darija display name; required. |
| `category` | Single select | One of the category identifiers already defined by the application. |
| `base_price` | Number | Base price in DH; zero or greater. |
| `available` | Checkbox | Controls whether the item appears in the menu. |
| `featured` | Checkbox | Controls whether the item appears in homepage specialties. |
| `image` | URL or single line text | Stable public URL or an existing `/images/menu/...` site path. |
| `included` | Long text | One ingredient per line using `French label | Darija label`. |
| `bread_options` | Long text | One choice per line using `French label | Darija label`. |
| `extras` | Long text | One extra per line using `French label | Darija label | price`. |

Blank option fields produce empty arrays. Whitespace around separators is ignored. A malformed option line is skipped rather than breaking the whole menu response.

### Data flow

```text
Airtable Menu grid
        ↓ server-only bearer token
Next.js /api/menu route
        ↓ validation + normalization
Existing MenuItem[] shape
        ↓ SWR client cache
Menu, specialties, customization, and cart
```

The existing `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID` environment variables remain server-only. The token requires only `data.records:read` access to the selected base. The browser never contacts Airtable directly.

### Validation and fallback

- Accept only known category identifiers.
- Require a non-empty `id`, French name, Darija name, and finite non-negative price.
- Deduplicate records by `id`; the first valid record wins.
- Normalize Airtable checkbox, number, text, and option fields into the existing `MenuItem` interface.
- If Airtable credentials are absent, the request fails, or no valid Airtable records remain, return `public/data/menu.json`.
- Log only a concise server-side warning; never log the bearer token or full Airtable response.
- Keep the existing five-minute server cache. Owner changes therefore appear within approximately five minutes without a redeploy.

### Initial setup

Provide a checked-in setup guide and a one-time CSV template derived from the local menu. The owner imports the CSV into Airtable, assigns the documented field types, creates a read-only personal access token scoped to the base, and adds the two environment variables to Vercel.

No Airtable write operations are needed from the website.

## Compact mobile cart

### Layout

The cart remains a bottom sheet with a maximum height based on `dvh`. It has three zones:

1. Sticky header: title, item count, and close control.
2. One scrollable body: compact item rows followed by customer details.
3. Sticky checkout footer: total and WhatsApp action above the device safe area.

The body, not the entire page, scrolls. The visible checkout footer reserves its own space so it never covers form controls or cart items.

### Cart summary

- Reduce item-card padding and vertical gaps.
- Keep item name, relevant choices, quantity controls, line price, and remove action.
- Use 44-pixel quantity and remove targets.
- Keep ingredient details readable but visually secondary.
- Do not hide the order summary when the customer-details form is present.

### Customer details

- Keep the name field visible.
- Place the `Sur place` / `À emporter` segmented control directly after the name.
- Replace the permanently expanded note textarea with a disclosure labeled `Ajouter une demande spéciale`.
- When expanded, show a two-row textarea and the existing help text.
- Preserve the 300-character limit and all French/Darija translations.

### Checkout footer

- Show the total in a compact horizontal row.
- Keep the WhatsApp button at least 56 pixels high.
- Include `env(safe-area-inset-bottom)` so the button clears Safari and iPhone home indicators.
- Disable no existing ordering behavior: tapping the action still opens the prefilled `wa.me` URL in a new tab.

### Accessibility and interaction

- Preserve the semantic dialog label and backdrop dismissal.
- Add Escape-key dismissal and move focus to the close control when the sheet opens.
- Return focus to the floating cart button when the sheet closes.
- Expose note disclosure state with `aria-expanded` and `aria-controls`.
- Retain visible keyboard focus, logical DOM order, RTL layout, and reduced-motion behavior.

## Component boundaries

- `app/api/menu/route.ts`: Airtable fetch, pagination, server cache, validation, and local fallback.
- `lib/menu-normalize.ts`: pure normalization and option-line parsing shared by the API and client fallback.
- `lib/use-menu.ts`: SWR data loading only; no Airtable-specific logic.
- `components/cart-drawer.tsx`: dialog state and high-level cart composition.
- `components/cart-line-item.tsx`: presentation and controls for one cart line.
- `components/cart-customer-details.tsx`: name, order mode, and optional-note disclosure.

Splitting the current cart component is in scope because it currently combines dialog orchestration, item rendering, form state, and checkout presentation in one dense file.

## Error handling

- Airtable errors are invisible to customers because the local menu is returned.
- Invalid individual Airtable rows are omitted while valid rows continue to load.
- If every Airtable row is invalid, use the full local fallback rather than showing an empty menu.
- The cart retains entered name, mode, and note while open. Closing and reopening during the same page session does not erase them.

## Testing and verification

- Unit-test option parsing, category validation, record validation, deduplication, and fallback selection.
- Component-test note disclosure and cart focus behavior where the current test setup permits.
- Verify French and Darija content, RTL layout, safe-area padding, and 375 px viewport behavior.
- Run the existing focused UI tests, TypeScript validation, and production build.
- The existing lint command remains a known repository tooling issue until ESLint is added separately.

## Out of scope

- Tracking WhatsApp clicks, sent messages, delivery status, or completed orders.
- WhatsApp Business Platform onboarding or webhooks.
- A custom website admin page, owner authentication, roles, audit history, or Airtable write APIs.
- Replacing Airtable with a full application database.
- Rebranding or changing the current menu/cart color system.
