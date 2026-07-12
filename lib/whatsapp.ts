import { WHATSAPP_NUMBER } from '@/lib/config'
import type { CartLine } from '@/lib/types'
import { lineSubtotal } from '@/lib/types'

export function buildOrderMessage(
  lines: CartLine[],
  customerName: string,
  mode: 'sur-place' | 'a-emporter',
): string {
  const parts: string[] = ['🥪 Commande — Snack Maestro', '']

  for (const line of lines) {
    const details: string[] = []
    if (line.bread) details.push(`Pain: ${line.bread}`)
    if (line.extras.length > 0) {
      details.push(`Extras: ${line.extras.map((e) => `${e.name} (+${e.price} DH)`).join(', ')}`)
    }
    parts.push(`▪ ${line.quantity}x ${line.item.name_fr}`)
    for (const d of details) parts.push(`   ${d}`)
    parts.push(`   Sous-total: ${lineSubtotal(line)} DH`)
  }

  const total = lines.reduce((sum, l) => sum + lineSubtotal(l), 0)
  parts.push('')
  parts.push(`💰 Total: ${total} DH`)
  parts.push(`👤 Nom: ${customerName || '—'}`)
  parts.push(`📍 ${mode === 'sur-place' ? 'Sur place' : 'À emporter'}`)

  return parts.join('\n')
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
