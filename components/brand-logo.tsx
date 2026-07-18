interface BrandLogoProps {
  compact?: boolean
  inverted?: boolean
}

export function BrandLogo({ compact = false, inverted = false }: BrandLogoProps) {
  if (compact) {
    return (
      <img
        src="/maestro-loading-logo.png"
        alt="Maestro Fast Food"
        className="h-auto w-28 shrink-0 object-contain sm:w-32"
      />
    )
  }

  return (
    <div
      className="flex w-[min(78vw,24rem)] shrink-0 flex-col items-center font-display uppercase leading-none"
      role="img"
      aria-label="Maestro Fast Food"
      dir="ltr"
    >
      <span
        aria-hidden="true"
        className={`text-[clamp(3rem,15vw,5.5rem)] font-black tracking-[-0.08em] text-primary ${
          inverted ? 'drop-shadow-[0_3px_1px_rgba(0,0,0,0.75)]' : ''
        }`}
      >
        Maestro
      </span>
      <span
        aria-hidden="true"
        className={`flex w-full items-center gap-3 text-sm font-black tracking-[0.32em] before:h-1 before:flex-1 before:bg-primary after:h-1 after:flex-1 after:bg-primary sm:text-base ${
          inverted ? 'text-background drop-shadow-[0_2px_1px_rgba(0,0,0,0.9)]' : 'text-foreground'
        }`}
      >
        Fast Food
      </span>
    </div>
  )
}
