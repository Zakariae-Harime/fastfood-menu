import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Archivo, Inter, Noto_Sans_Arabic } from 'next/font/google'
import { LanguageProvider } from '@/lib/language-context'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-archivo',
})

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '600'],
  variable: '--font-arabic',
})

export const metadata: Metadata = {
  title: 'Snack Maestro — Fast Food Tanger',
  description:
    'Snack Maestro, bocadillos et fast food à Tanger. Consultez le menu et commandez directement sur WhatsApp.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#FDF6EC',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`bg-background ${inter.variable} ${archivo.variable} ${notoArabic.variable}`}>
      <body className="font-sans antialiased">
        <LanguageProvider>{children}</LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
