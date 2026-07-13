'use client'

import { useRef, useState } from 'react'
import { ArrowUpRight, Clock, LoaderCircle, MapPin, Navigation, Phone, RotateCcw } from 'lucide-react'
import { OpenStatusBadge } from '@/components/open-status-badge'
import { SHOP_INFO, WHATSAPP_NUMBER } from '@/lib/config'
import { useLanguage } from '@/lib/language-context'

type MapState = 'place' | 'locating' | 'route'
const createRouteEmbedUrl = (latitude: number, longitude: number) => `https://www.google.com/maps?saddr=${encodeURIComponent(`${latitude},${longitude}`)}&daddr=${encodeURIComponent(`${SHOP_INFO.coordinates.latitude},${SHOP_INFO.coordinates.longitude}`)}&output=embed`

export function LocationMap() {
  const { t } = useLanguage()
  const [mapState, setMapState] = useState<MapState>('place')
  const [mapUrl, setMapUrl] = useState(SHOP_INFO.mapEmbedUrl)
  const [error, setError] = useState('')
  const mapHeadingRef = useRef<HTMLDivElement>(null)
  const getError = (locationError: GeolocationPositionError) => locationError.code === locationError.PERMISSION_DENIED ? t('map.permission') : locationError.code === locationError.TIMEOUT ? t('map.timeout') : t('map.unavailable')

  function showRoute() {
    setError('')
    mapHeadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (!navigator.geolocation) { setError(t('map.unsupported')); return }
    setMapState('locating')
    navigator.geolocation.getCurrentPosition(({ coords }) => { setMapUrl(createRouteEmbedUrl(coords.latitude, coords.longitude)); setMapState('route') }, (locationError) => { setMapState('place'); setError(getError(locationError)) }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 })
  }
  function resetMap() { setMapUrl(SHOP_INFO.mapEmbedUrl); setMapState('place'); setError('') }

  return <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:grid lg:grid-cols-[1.15fr_0.85fr]">
    <div ref={mapHeadingRef} className="relative min-h-72 scroll-mt-6 overflow-hidden bg-muted lg:min-h-full">
      <iframe src={mapUrl} title={t(mapState === 'route' ? 'map.routeTitle' : 'map.placeTitle')} className="absolute inset-0 size-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      <div className="pointer-events-none absolute start-4 top-4 rounded-full bg-card px-4 py-2 text-xs font-bold text-card-foreground shadow-md">{mapState === 'route' ? t('map.yourRoute') : 'Snack Maestro'}</div>
      {mapState === 'route' ? <button type="button" onClick={resetMap} className="absolute bottom-4 start-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-card px-4 text-xs font-bold text-card-foreground shadow-md hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><RotateCcw className="size-4" aria-hidden="true" />{t('map.reset')}</button> : null}
    </div>
    <div className="flex flex-col gap-6 p-6 sm:p-8">
      <div className="flex flex-col gap-4">
        <a href={SHOP_INFO.mapsUrl} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 text-card-foreground underline-offset-4 hover:underline"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent"><MapPin className="size-5 text-accent-foreground" aria-hidden="true" /></span><span className="pt-1 text-sm leading-relaxed" dir="ltr"><span className="block font-bold">Snack Maestro</span>{SHOP_INFO.address}</span></a>
        <a href={`tel:+${WHATSAPP_NUMBER}`} className="flex items-center gap-3 text-card-foreground underline-offset-4 hover:underline"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent"><Phone className="size-5 text-accent-foreground" aria-hidden="true" /></span><span className="text-sm font-semibold" dir="ltr">{SHOP_INFO.phoneDisplay}</span></a>
        <div className="flex flex-wrap items-center gap-3 text-card-foreground"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent"><Clock className="size-5 text-accent-foreground" aria-hidden="true" /></span><span className="text-sm" dir="ltr">{SHOP_INFO.hours}</span><OpenStatusBadge /></div>
      </div>
      <div className="flex flex-col gap-3">
        <button id="itineraire" type="button" onClick={showRoute} disabled={mapState === 'locating'} className="inline-flex min-h-12 scroll-mt-6 items-center justify-center gap-2 rounded-full bg-primary px-6 font-bold text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:cursor-wait disabled:opacity-70">{mapState === 'locating' ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <Navigation className="size-5" aria-hidden="true" />}{t(mapState === 'locating' ? 'map.locating' : mapState === 'route' ? 'map.refresh' : 'map.route')}</button>
        <a href={SHOP_INFO.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">{t('map.open')}<ArrowUpRight className="size-4" aria-hidden="true" /></a>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 font-semibold text-whatsapp-foreground hover:-translate-y-0.5 hover:shadow-lg active:scale-95"><Phone className="size-5" aria-hidden="true" />{t('map.order')}</a>
        <p className="min-h-5 text-center text-xs leading-relaxed text-destructive" role="status" aria-live="polite">{error}</p>
      </div>
    </div>
  </div>
}
