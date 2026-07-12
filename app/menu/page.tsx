import type { Metadata } from 'next'
import { MenuClient } from '@/components/menu-client'

export const metadata: Metadata = {
  title: 'Menu — Snack Maestro',
  description:
    'Le menu de Snack Maestro à Tanger : bocadillos, boissons et extras. Personnalisez et commandez sur WhatsApp.',
}

export default function MenuPage() {
  return <MenuClient />
}
