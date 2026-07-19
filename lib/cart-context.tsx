'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { CartLine, IngredientChoice, MenuExtra, MenuItem } from '@/lib/types'
import { lineSubtotal } from '@/lib/types'

interface CartContextValue {
  lines: CartLine[]
  addLine: (
    item: MenuItem,
    bread: MenuItem['bread_options'][number] | null,
    extras: MenuExtra[],
    ingredients: IngredientChoice[],
    quantity: number,
  ) => CartLine
  updateQuantity: (uid: string, quantity: number) => void
  removeLine: (uid: string) => void
  clearCart: () => void
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])

  const addLine = useCallback<CartContextValue['addLine']>(
    (item, bread, extras, ingredients, quantity) => {
      const line: CartLine = {
        uid: `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        item,
        bread,
        extras,
        ingredients,
        quantity,
      }
      setLines((prev) => [...prev, line])
      return line
    },
    [],
  )

  const updateQuantity = useCallback((uid: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.uid !== uid)
        : prev.map((l) => (l.uid === uid ? { ...l, quantity } : l)),
    )
  }, [])

  const removeLine = useCallback((uid: string) => {
    setLines((prev) => prev.filter((l) => l.uid !== uid))
  }, [])

  const clearCart = useCallback(() => setLines([]), [])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0)
    const total = lines.reduce((sum, l) => sum + lineSubtotal(l), 0)
    return { lines, addLine, updateQuantity, removeLine, clearCart, itemCount, total }
  }, [lines, addLine, updateQuantity, removeLine, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
