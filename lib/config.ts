// ============================================================
// CONFIGURATION — Snack Maestro, Tanger
// ============================================================

// WhatsApp number in international format, no "+" and no spaces.
export const WHATSAPP_NUMBER = '212661393826'

// Menu data source: a server-side route that proxies Airtable (see
// app/api/menu/route.ts), so the Airtable token never reaches the browser.
// Requires AIRTABLE_TOKEN and AIRTABLE_BASE_ID env vars to be set — until
// then this quietly falls back to the local /data/menu.json below.
export const REMOTE_MENU_URL = '/api/menu'

// Local fallback served from /public/data/menu.json
export const LOCAL_MENU_URL = '/data/menu.json'

// Find the restaurant's Place ID at https://developers.google.com/maps/documentation/places/web-service/place-id
// and replace this placeholder to link directly to Google's review composer.
export const GOOGLE_PLACE_ID = 'REPLACE_WITH_GOOGLE_PLACE_ID'

export const SHOP_INFO = {
  name: 'Snack Maestro',
  tagline: 'Fast Food • Tanger',
  intro: 'Bocadillos généreux, produits frais, sauces maison. Servi avec le sourire depuis le cœur de Tanger.',
  hours: 'Tous les jours · 11h00 – 02h00',
  openTime: '11:00', // 24h format — feeds the live "ouvert / fermé" badge, keep in sync with `hours` above
  closeTime: '02:00', // past midnight is handled automatically
  address: 'Q5JM+9JW, Tanger, Maroc',
  landmark: '', // optional, e.g. "Près de la Mosquée ..." — shown next to the address if set
  phoneDisplay: '06 61 39 38 26',
  coordinates: {
    latitude: 35.7809773,
    longitude: -5.8159282,
  },
  mapsUrl: 'https://maps.app.goo.gl/x6LtTPYBETDf544X9',
  mapEmbedUrl:
    'https://www.google.com/maps?q=35.7809773,-5.8159282&z=16&output=embed',
}

export const GOOGLE_REVIEW_URL = GOOGLE_PLACE_ID.startsWith('REPLACE_')
  ? SHOP_INFO.mapsUrl
  : `https://search.google.com/local/writereview?placeid=${encodeURIComponent(GOOGLE_PLACE_ID)}`
