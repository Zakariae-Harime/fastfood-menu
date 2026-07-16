# Airtable menu setup

Airtable is the owner dashboard for menu content. The website reads it through a server-only connection; there is no website admin page. This setup does not track WhatsApp orders, messages, delivery status, or completed orders.

## 1. Import the menu

1. Create a new Airtable base for the restaurant menu.
2. Import `airtable-menu-template.csv` from this folder as a CSV file.
3. Name the imported table exactly `Menu` (including the capital `M`).
4. Keep the imported field names unchanged. The application expects: `id`, `name_fr`, `name_darija`, `category`, `base_price`, `available`, `featured`, `image`, `included`, `bread_options`, and `extras`.

Each `id` must be filled in and unique. Treat it as a permanent identifier: edit the other fields instead of changing an existing item's `id`.

To regenerate the CSV from the local fallback menu later, run:

```bash
node scripts/export-airtable-menu.mjs
```

## 2. Set field types

Set the Airtable fields to these types after import:

| Field | Airtable field type |
| --- | --- |
| `id` | Single line text (primary field) |
| `name_fr` | Single line text |
| `name_darija` | Single line text |
| `category` | Single select |
| `base_price` | Number |
| `available` | Checkbox |
| `featured` | Checkbox |
| `image` | URL |
| `included` | Long text |
| `bread_options` | Long text |
| `extras` | Long text |

Do not rename or delete these fields. Category values must match the imported options exactly.

## 3. Create owner views

Create these views in the `Menu` table:

- **Menu complet**: no filter; shows every item.
- **Disponibles**: filter where `available` is checked.
- **Indisponibles**: filter where `available` is not checked.
- **À la une**: filter where `featured` is checked.

These views are for editing convenience and do not change what the application can read.

## 4. Connect Vercel

1. In Airtable, create a personal access token restricted to this menu base with only the `data.records:read` scope. Do not grant write access.
2. Copy the base ID from Airtable's API documentation for the base.
3. In the Vercel project, add `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID` under **Settings → Environment Variables**. Add them to Preview and Production, then redeploy each environment.

Both variables are server-only. Never paste the token into source code, commit it, or put either credential in a client-exposed variable such as one prefixed with `NEXT_PUBLIC_`.

For local server-side testing, create an untracked `.env.local` file:

```dotenv
AIRTABLE_TOKEN=pat_your_read_only_token
AIRTABLE_BASE_ID=app_your_base_id
```

The application caches Airtable menu responses for five minutes. If credentials are absent, Airtable is unavailable, or Airtable returns no valid menu rows, the application automatically serves `public/data/menu.json` as its fallback. Customers therefore keep seeing a menu even during an Airtable outage.

Before changing Production, verify a Preview deployment:

1. Open `/api/menu` and confirm it returns a non-empty JSON array with the Airtable item IDs.
2. Open `/menu` and verify French and Darija names, prices, categories, images, options, and extras.
3. Uncheck `available` on one test item, wait up to five minutes, and refresh `/api/menu`. Confirm the row remains in the response with `available: false`.
4. Refresh `/menu` and confirm the unavailable item is hidden. Check `available` again and confirm the item returns to `/menu` after the cache refresh.

## 5. Daily editing

Uncheck `available` to hide an item instead of deleting its row. Use `featured` to control the **À la une** view and featured menu treatment. Changes can take up to five minutes to appear because of the menu cache.

Enter one option per line in `included` and `bread_options` using:

```text
French | Darija
```

Enter one extra per line in `extras` using:

```text
French | Darija | price
```

Use a number without a currency symbol for `base_price` and each extra price. Leave optional lists or `image` blank when they do not apply.

To roll back a content edit, restore the previous Airtable field values or availability checkbox, then allow up to five minutes for the cache to refresh. To disconnect Airtable completely, remove `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID` from the affected Vercel environment and redeploy; the site will use `public/data/menu.json`. The generated CSV is an import template, not an order log or a substitute for maintaining the local fallback.
