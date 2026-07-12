'use client'

import { useEffect, useState } from 'react'

/**
 * Renders the hero video only after the client has mounted.
 * Video-related browser extensions (e.g. Ultrawidify) inject DOM nodes
 * next to <video> elements as soon as they appear in the HTML, which
 * breaks React hydration if the video is server-rendered. By mounting
 * the video post-hydration, the extension can only act after React is
 * in control, eliminating the mismatch. The poster image is shown as
 * the SSR fallback so there is no visual gap.
 */
export function HeroVideo() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <img
        src="/images/hero.png"
        alt="Chef de Snack Maestro préparant un bocadillo derrière le comptoir"
        className="absolute inset-0 h-full w-full object-cover"
      />
    )
  }

  return (
    <video
      src="/videos/hero.mp4"
      poster="/images/hero.png"
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 h-full w-full object-cover"
      aria-label="Chef de Snack Maestro préparant un bocadillo derrière le comptoir"
    />
  )
}
