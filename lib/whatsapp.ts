import { WHATSAPP_NUMBER } from '@/lib/config'
import type { CartLine } from '@/lib/types'
import { lineSubtotal } from '@/lib/types'

// Traductions darija (arabe marocain) des pains et des extras.
// La donnée du menu reste en français ; on traduit uniquement au moment
// d'écrire la commande WhatsApp. Toute clé absente retombe sur le texte d'origine.
const DARIJA: Record<string, string> = {
  // Pains
  Baguette: 'باكيط',
  'Pain rond': 'خبز مدور',
  Panini: 'بانيني',
  // Extras
  Fromage: 'فرماج',
  'Viande hachée': 'لحم مفروم',
  'Double viande': 'لحم مضاعف',
  'Double kefta': 'كفتة مضاعفة',
  Oeuf: 'بيضة',
  'Oeuf supplémentaire': 'بيضة زايدة',
  Champignons: 'شامبينيون',
  'Frites dedans': 'فريط داخل',
  'Sauce harissa': 'هريسة',
  'Sauce algérienne': 'صوص جزائرية',
  'Sauce barbecue': 'صوص باربكيو',
}

function toDarija(label: string): string {
  return DARIJA[label] ?? label
}

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
    if (line.bread) parts.push(`   الخبز: ${toDarija(line.bread)}`)
    if (line.extras.length > 0) {
      parts.push(
        `   الزيادة: ${line.extras.map((e) => `${toDarija(e.name)} (+${e.price} درهم)`).join('، ')}`,
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
