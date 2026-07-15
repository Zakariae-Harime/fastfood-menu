const LOGO_SOURCE =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-07-13%20at%2020.59.04%20%282%29-kXymkQ9Md5notPK2kx0WXLm461pyeO.jpeg'

interface BrandLogoProps {
  compact?: boolean
  inverted?: boolean
}

export function BrandLogo({ compact = false, inverted = false }: BrandLogoProps) {
  return (
    <div
      className={
        compact
          ? 'relative h-12 w-28 shrink-0 overflow-hidden'
          : 'relative h-44 w-[min(82vw,26rem)] overflow-hidden sm:h-52'
      }
    >
      <img
        src={LOGO_SOURCE}
        alt="Maestro Fast Food"
        width={1132}
        height={1600}
        className={`absolute left-1/2 max-w-none -translate-x-1/2 ${
          compact
            ? '-top-6 w-32'
            : '-top-[9.2rem] w-[min(82vw,26rem)] sm:-top-[10.8rem]'
        } ${inverted ? 'mix-blend-screen' : 'mix-blend-multiply'}`}
        decoding="async"
      />
    </div>
  )
}
