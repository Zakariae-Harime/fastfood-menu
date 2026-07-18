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

// Google Place ID for Snack Maestro, Tangier
export const GOOGLE_PLACE_ID = 'ChIJXaXwdYd5DA0Rn8Jg17CtmRU'

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

// Opens the Reviews section for this exact business instead of its Overview tab.
export const GOOGLE_REVIEW_URL = `https://search.google.com/local/reviews?placeid=${GOOGLE_PLACE_ID}`

// Target the exact listing by Place ID so Maps never falls back to a broad
// name search that can show similarly named restaurants.
const GOOGLE_MAPS_EXACT_PLACE_PATH = `www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOP_INFO.name)}&query_place_id=${GOOGLE_PLACE_ID}`

// Mobile deep links prefer the installed Google Maps app. The review URL above
// remains the browser fallback when Maps is unavailable.
export const GOOGLE_MAPS_IOS_REVIEW_URL = `comgooglemaps://${GOOGLE_MAPS_EXACT_PLACE_PATH}`
export const GOOGLE_MAPS_ANDROID_REVIEW_URL = `intent://${GOOGLE_MAPS_EXACT_PLACE_PATH}#Intent;scheme=https;package=com.google.android.apps.maps;S.browser_fallback_url=${encodeURIComponent(GOOGLE_REVIEW_URL)};end`
