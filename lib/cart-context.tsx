'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export interface CartItem {
  id: number
  name: string
  price: number
  color: string
  size: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number, size: string, color: string) => void
  updateQuantity: (id: number, size: string, color: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.id === item.id && i.size === item.size && i.color === item.color
      )

      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }

      return [...prevItems, item]
    })
  }, [])

  const removeItem = useCallback(
    (id: number, size: string, color: string) => {
      setItems((prevItems) =>
        prevItems.filter((i) => !(i.id === id && i.size === size && i.color === color))
      )
    },
    []
  )

  const updateQuantity = useCallback(
    (id: number, size: string, color: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id, size, color)
        return
      }

      setItems((prevItems) =>
        prevItems.map((i) =>
          i.id === id && i.size === size && i.color === color
            ? { ...i, quantity }
            : i
        )
      )
    },
    [removeItem]
  )

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        cartCount: itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
