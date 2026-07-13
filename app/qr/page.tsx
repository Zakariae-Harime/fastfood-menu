import type { Metadata } from 'next'
import { QrPageContent } from '@/components/qr-page-content'

export const metadata: Metadata = {
  title: 'QR Codes — Snack Maestro',
  description: 'QR codes à imprimer pour accéder au menu de Snack Maestro.',
}

export default function QrPage() {
  return <QrPageContent />
}
