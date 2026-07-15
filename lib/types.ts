export const MENU_CATEGORIES = [
  'EntreesFroides',
  'Pizza',
  'SandwichsFrais',
  'SandwichsChauds',
  'Panini',
  'Shawarma',
  'Tagine',
  'Pasticcio',
  'Pates',
  'PlatsChauds',
  'Foure',
  'Hamburgers',
  'Tacos',
  'PlatsSpeciaux',
  'Boissons',
] as const

export type MenuCategory = (typeof MENU_CATEGORIES)[number]

// A bread choice or included ingredient, carrying both the French label
// shown in the UI and the Darija label used in the WhatsApp order message.
export interface Ingredient {
  name: string
  name_darija: string
}

export interface MenuExtra {
  name: string
  name_darija: string
  price: number
}

// How much of an included ingredient the customer wants:
// 0 = removed ("sans"), 1 = default, 2+ = extra portions.
export interface IngredientChoice {
  ingredient: Ingredient
  quantity: number
}

export interface MenuItem {
  id: string
  name_fr: string
  name_darija: string
  category: MenuCategory
  base_price: number
  bread_options: Ingredient[]
  included: Ingredient[]
  extras: MenuExtra[]
  available: boolean
  featured?: boolean
  image?: string
}

export interface CartLine {
  uid: string
  item: MenuItem
  bread: Ingredient | null
  extras: MenuExtra[]
  // Included ingredients whose quantity differs from the default of 1
  // (removed or added extra portions). Untouched ingredients are omitted.
  ingredients: IngredientChoice[]
  quantity: number
}

export function lineSubtotal(line: CartLine): number {
  const extrasTotal = line.extras.reduce((sum, e) => sum + e.price, 0)
  return (line.item.base_price + extrasTotal) * line.quantity
}

export function formatPrice(price: number): string {
  return `${price} DH`
}
