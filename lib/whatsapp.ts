import { WHATSAPP_NUMBER } from '@/lib/config'
import type { Language } from '@/lib/language-context'
import type { CartLine } from '@/lib/types'
import { lineSubtotal } from '@/lib/types'

export function buildOrderMessage(lines: CartLine[], customerName: string, mode: 'sur-place' | 'a-emporter', language: Language, customerNote = ''): string {
  const darija = language === 'darija'
  const parts: string[] = [darija ? 'طلب جديد — سناك مايسترو' : 'Nouvelle commande — Snack Maestro', '']
  for (const line of lines) {
    parts.push(`• ${line.quantity}× ${darija ? line.item.name_darija : line.item.name_fr}`)
    if (line.bread) parts.push(`   ${darija ? 'الخبز' : 'Pain'}: ${darija ? line.bread.name_darija : line.bread.name}`)
    const removed = line.ingredients.filter((choice) => choice.quantity === 0)
    const added = line.ingredients.filter((choice) => choice.quantity > 1)
    if (removed.length) parts.push(`   ${darija ? 'بلا' : 'Sans'}: ${removed.map((choice) => darija ? choice.ingredient.name_darija : choice.ingredient.name).join(darija ? '، ' : ', ')}`)
    if (added.length) parts.push(`   ${darija ? 'زيادة' : 'En plus'}: ${added.map((choice) => `${darija ? choice.ingredient.name_darija : choice.ingredient.name} ×${choice.quantity}`).join(darija ? '، ' : ', ')}`)
    if (line.extras.length) parts.push(`   ${darija ? 'إكسترا' : 'Extras'}: ${line.extras.map((extra) => `${darija ? extra.name_darija : extra.name} (+${extra.price} DH)`).join(darija ? '، ' : ', ')}`)
    parts.push(`   ${darija ? 'الثمن' : 'Prix'}: ${lineSubtotal(line)} DH`)
  }
  const total = lines.reduce((sum, line) => sum + lineSubtotal(line), 0)
  parts.push('', `${darija ? 'المجموع' : 'Total'}: ${total} DH`, `${darija ? 'السميّة' : 'Nom'}: ${customerName || '—'}`, darija ? (mode === 'sur-place' ? 'ناكل فالمحل' : 'نديه معايا') : (mode === 'sur-place' ? 'Sur place' : 'À emporter'))
  const note = customerNote.trim()
  if (note) parts.push('', `${darija ? 'ملاحظة للطلب' : 'Note pour la commande'}:`, note)
  return parts.join('\n')
}

export function buildWhatsAppUrl(message: string) { return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}` }
