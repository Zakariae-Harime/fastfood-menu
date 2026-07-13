'use client'

import { useRef, useState } from 'react'
import { ArrowUpRight, Clock, LoaderCircle, MapPin, Navigation, Phone, RotateCcw } from 'lucide-react'
import { OpenStatusBadge } from '@/components/open-status-badge'
import { SHOP_INFO, WHATSAPP_NUMBER } from '@/lib/config'

type MapState = 'place' | 'locating' | 'route'

function createRouteEmbedUrl(latitude: number, longitude: number) {
  const origin = `${latitude},${longitude}`
  const destination = `${SHOP_INFO.coordinates.latitude},${SHOP_INFO.coordinates.longitude}`

  return `https://www.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}&output=embed`
}

function getLocationErrorMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return "Autorisez l’accès à votre position dans votre navigateur, puis réessayez."
  }

  if (error.code === error.TIMEOUT) {
    return 'Votre position met trop de temps à répondre. Réessayez dans un instant.'
  }

  return "Votre position n’est pas disponible pour le moment. Vous pouvez ouvrir Google Maps à la place."
}

export function LocationMap() {
  const [mapState, setMapState] = useState<MapState>('place')
  const [mapUrl, setMapUrl] = useState(SHOP_INFO.mapEmbedUrl)
  const [error, setError] = useState('')
  const mapHeadingRef = useRef<HTMLDivElement>(null)

  function showRoute() {
    setError('')
    mapHeadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

    if (!navigator.geolocation) {
      setError("Votre navigateur ne permet pas de détecter votre position. Ouvrez Google Maps pour l’itinéraire.")
      return
    }

    setMapState('locating')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setMapUrl(createRouteEmbedUrl(coords.latitude, coords.longitude))
        setMapState('route')
      },
      (locationError) => {
        setMapState('place')
        setError(getLocationErrorMessage(locationError))
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  function resetMap() {
    setMapUrl(SHOP_INFO.mapEmbedUrl)
    setMapState('place')
    setError('')
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:grid lg:grid-cols-[1.15fr_0.85fr]">
      <div ref={mapHeadingRef} className="relative min-h-72 scroll-mt-6 overflow-hidden bg-muted lg:min-h-full">
        <iframe
          src={mapUrl}
          title={mapState === 'route' ? 'Itinéraire vers Snack Maestro depuis votre position' : 'Carte Google Maps de Snack Maestro à Tanger'}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-card px-4 py-2 text-xs font-bold text-card-foreground shadow-md">
          {mapState === 'route' ? 'Votre itinéraire' : 'Snack Maestro'}
        </div>
        {mapState === 'route' && (
          <button
            type="button"
            onClick={resetMap}
            className="absolute bottom-4 left-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-card px-4 text-xs font-bold text-card-foreground shadow-md hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Revenir au plan
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex flex-col gap-4">
          <a href={SHOP_INFO.mapsUrl} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 text-card-foreground underline-offset-4 hover:underline">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent">
              <MapPin className="size-5 text-accent-foreground" aria-hidden="true" />
            </span>
            <span className="pt-1 text-sm leading-relaxed">
              <span className="block font-bold">Snack Maestro</span>
              {SHOP_INFO.address}
            </span>
          </a>
          <a href={`tel:+${WHATSAPP_NUMBER}`} className="flex items-center gap-3 text-card-foreground underline-offset-4 hover:underline">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent">
              <Phone className="size-5 text-accent-foreground" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold">{SHOP_INFO.phoneDisplay}</span>
          </a>
          <div className="flex items-center gap-3 text-card-foreground">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent">
              <Clock className="size-5 text-accent-foreground" aria-hidden="true" />
            </span>
            <span className="text-sm">{SHOP_INFO.hours}</span>
            <OpenStatusBadge />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            id="itineraire"
            type="button"
            onClick={showRoute}
            disabled={mapState === 'locating'}
            className="inline-flex min-h-12 scroll-mt-6 items-center justify-center gap-2 rounded-full bg-primary px-6 font-bold text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:cursor-wait disabled:opacity-70"
          >
            {mapState === 'locating' ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <Navigation className="size-5" aria-hidden="true" />}
            {mapState === 'locating' ? 'Localisation…' : mapState === 'route' ? 'Actualiser l’itinéraire' : 'Voir l’itinéraire'}
          </button>
          <a href={SHOP_INFO.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
            Ouvrir Google Maps
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 font-semibold text-whatsapp-foreground hover:-translate-y-0.5 hover:shadow-lg active:scale-95">
            <Phone className="size-5" aria-hidden="true" />
            Commander sur WhatsApp
          </a>
          <p className="min-h-5 text-center text-xs leading-relaxed text-destructive" role="status" aria-live="polite">
            {error}
          </p>
        </div>
      </div>
    </div>
  )
}
