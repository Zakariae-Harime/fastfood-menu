import { WHATSAPP_NUMBER } from '@/lib/config'
import type { CartLine } from '@/lib/types'
import { lineSubtotal } from '@/lib/types'

export function buildOrderMessage(
  lines: CartLine[],
  customerName: string,
  mode: 'sur-place' | 'a-emporter',
): string {
  const parts: string[] = ['🥪 طلب جديد — سناك مايسترو', '']
  for (const line of lines) {
    parts.push(`▪ ${line.quantity}× ${line.item.name_darija}`)
    if (line.bread) parts.push(`   الخبز: ${line.bread.name_darija}`)

    // Removed ingredients ("بلا …") and added extra portions ("… ×2").
    const removed = line.ingredients.filter((c) => c.quantity === 0)
    const added = line.ingredients.filter((c) => c.quantity > 1)
    if (removed.length > 0) {
      parts.push(`   بلا: ${removed.map((c) => c.ingredient.name_darija).join('، ')}`)
    }
    if (added.length > 0) {
      parts.push(
        `   زيادة: ${added.map((c) => `${c.ingredient.name_darija} ×${c.quantity}`).join('، ')}`,
      )
    }

    if (line.extras.length > 0) {
      parts.push(
        `   إكسترا: ${line.extras.map((e) => `${e.name_darija} (+${e.price} درهم)`).join('، ')}`,
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
