export type MenuCategory = 'Sandwichs' | 'Boissons' | 'Extras'

export interface MenuExtra {
  name: string
  price: number
}

export interface MenuItem {
  id: string
  name_fr: string
  name_darija: string
  category: MenuCategory
  base_price: number
  bread_options: string[]
  included: string[]
  extras: MenuExtra[]
  available: boolean
  featured?: boolean
  image?: string
}

export interface CartLine {
  uid: string
  item: MenuItem
  bread: string | null
  extras: MenuExtra[]
  quantity: number
}

export function lineSubtotal(line: CartLine): number {
  const extrasTotal = line.extras.reduce((sum, e) => sum + e.price, 0)
  return (line.item.base_price + extrasTotal) * line.quantity
}

export function formatPrice(price: number): string {
  return `${price} DH`
}
