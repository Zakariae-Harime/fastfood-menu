'use client'

import { useEffect, useRef, useState } from 'react'

const HERO_ALT = 'Chef de Snack Maestro preparant un bocadillo derriere le comptoir'

/**
 * Keeps the poster as the stable hero background, then fades the video in
 * only after the browser confirms playback. On iOS, blocked autoplay otherwise
 * exposes a native play button over the hero.
 */
export function HeroVideo() {
  const [mounted, setMounted] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.volume = 0
    video.controls = false
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    video.play().catch(() => setVideoPlaying(false))
  }, [mounted])

  return (
    <>
      <img
        src="/images/hero.png"
        alt={HERO_ALT}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {mounted ? (
        <video
          ref={videoRef}
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          preload="auto"
          onPlaying={() => setVideoPlaying(true)}
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${videoPlaying ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden="true"
          tabIndex={-1}
        />
      ) : null}
    </>
  )
}
