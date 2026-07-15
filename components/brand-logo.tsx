interface BrandLogoProps {
  compact?: boolean
  inverted?: boolean
}

export function BrandLogo({ compact = false, inverted = false }: BrandLogoProps) {
  return (
    <div
      className={`flex shrink-0 flex-col items-center font-display uppercase leading-none ${
        compact ? 'w-20' : 'w-[min(78vw,24rem)]'
      }`}
      role="img"
      aria-label="Maestro Fast Food"
      dir="ltr"
    >
      <span
        aria-hidden="true"
        className={`font-black tracking-[-0.08em] ${
          compact ? 'text-xl' : 'text-[clamp(3rem,15vw,5.5rem)]'
        } ${inverted ? 'text-primary drop-shadow-[0_3px_1px_rgba(0,0,0,0.75)]' : 'text-primary'}`}
      >
        Maestro
      </span>
      <span
        aria-hidden="true"
        className={`flex w-full items-center font-black tracking-[0.32em] before:h-1 before:flex-1 before:bg-primary after:h-1 after:flex-1 after:bg-primary ${
          compact ? 'gap-1.5 text-[0.55rem]' : 'gap-3 text-sm sm:text-base'
        } ${inverted ? 'text-background drop-shadow-[0_2px_1px_rgba(0,0,0,0.9)]' : 'text-foreground'}`}
      >
        Fast Food
      </span>
    </div>
  )
}
