'use client'

import { useEffect, useRef, useState } from 'react'

const HERO_ALT = 'Chef de Snack Maestro preparant un bocadillo derriere le comptoir'

/**
 * Renders the video in the initial markup so mobile Safari can start loading
 * it immediately. The poster sits above it until playback is confirmed.
 */
export function HeroVideo() {
  const [videoPlaying, setVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.volume = 0
    video.controls = false
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    video.play().catch(() => setVideoPlaying(false))
  }, [])

  return (
    <>
      <video
        ref={videoRef}
        src="/videos/hero.mp4"
        poster="/images/hero.png"
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        preload="auto"
        onPlaying={() => setVideoPlaying(true)}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
        tabIndex={-1}
      />
      <img
        src="/images/hero.png"
        alt={HERO_ALT}
        fetchPriority="high"
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${videoPlaying ? 'opacity-0' : 'opacity-100'}`}
      />
    </>
  )
}
