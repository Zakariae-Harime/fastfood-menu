import { WHATSAPP_NUMBER } from '@/lib/config'
import type { CartLine } from '@/lib/types'
import { lineSubtotal } from '@/lib/types'

// Le récapitulatif de commande est rédigé en darija (arabe marocain),
// la langue parlée par les clients du snack.
export function buildOrderMessage(
  lines: CartLine[],
  customerName: string,
  mode: 'sur-place' | 'a-emporter',
): string {
  const parts: string[] = ['🥪 طلب جديد — سناك مايسترو', '']

  for (const line of lines) {
    parts.push(`▪ ${line.quantity}× ${line.item.name_darija}`)
    if (line.bread) parts.push(`   الخبز: ${line.bread}`)
    if (line.extras.length > 0) {
      parts.push(
        `   الزيادة: ${line.extras.map((e) => `${e.name} (+${e.price} درهم)`).join('، ')}`,
      )
    }
    parts.push(`   الثمن: ${lineSubtotal(line)} درهم`)
  }

  const total = lines.reduce((sum, l) => sum + lineSubtotal(l), 0)
  parts.push('')
  parts.push(`💰 المجموع: ${total} درهم`)
  parts.push(`👤 السمية: ${customerName || '—'}`)
  parts.push(`📍 ${mode === 'sur-place' ? 'ناكل فالمحل' : 'نديه معايا'}`)

  return parts.join('\n')
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
