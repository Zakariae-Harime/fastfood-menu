interface BrandLogoProps {
  compact?: boolean
  inverted?: boolean
}

export function BrandLogo({ compact = false, inverted = false }: BrandLogoProps) {
  return (
    <img
      src="/maestro-loading-logo.png"
      alt="Maestro Fast Food"
      className={`h-auto shrink-0 object-contain ${
        compact ? 'w-28 sm:w-32' : 'w-[min(78vw,27rem)]'
      } ${inverted ? 'drop-shadow-[0_3px_6px_rgba(0,0,0,0.65)]' : ''}`}
    />
  )
}
