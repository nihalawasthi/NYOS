'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

export interface CartItem {
  id: number
  name: string
  price: number
  color: string
  size: string
  quantity: number
  stock?: number
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
const CART_STORAGE_KEY = 'nyos_cart'
const CART_EXPIRY_KEY = 'nyos_cart_expiry'
const CART_EXPIRY_DAYS = 7

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    const expiryDate = localStorage.getItem(CART_EXPIRY_KEY)

    if (savedCart && expiryDate) {
      // Check if cart has expired
      if (new Date(expiryDate) > new Date()) {
        try {
          const parsedCart = JSON.parse(savedCart)
          setItems(parsedCart)
        } catch (error) {
          console.error('Failed to parse saved cart:', error)
          localStorage.removeItem(CART_STORAGE_KEY)
          localStorage.removeItem(CART_EXPIRY_KEY)
        }
      } else {
        // Cart has expired, clear it
        localStorage.removeItem(CART_STORAGE_KEY)
        localStorage.removeItem(CART_EXPIRY_KEY)
      }
    }

    setIsHydrated(true)
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isHydrated) {
      if (items.length > 0) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
        
        // Set expiry date to 7 days from now
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + CART_EXPIRY_DAYS)
        localStorage.setItem(CART_EXPIRY_KEY, expiryDate.toISOString())
      } else {
        // Clear storage if cart is empty
        localStorage.removeItem(CART_STORAGE_KEY)
        localStorage.removeItem(CART_EXPIRY_KEY)
      }
    }
  }, [items, isHydrated])

  const addItem = useCallback((item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.id === item.id && i.size === item.size && i.color === item.color
      )

      if (existingItem) {
        return prevItems.map((i) => {
          if (i.id === item.id && i.size === item.size && i.color === item.color) {
            const newQuantity = i.quantity + item.quantity
            // Check stock limit if stock information is available
            if (item.stock !== undefined && newQuantity > item.stock) {
              alert(`Only ${item.stock} units available in stock`)
              return { ...i, quantity: item.stock }
            }
            return { ...i, quantity: newQuantity }
          }
          return i
        })
      }

      // Check stock limit for new items
      if (item.stock !== undefined && item.quantity > item.stock) {
        alert(`Only ${item.stock} units available in stock`)
        return [...prevItems, { ...item, quantity: item.stock }]
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
        prevItems.map((i) => {
          if (i.id === id && i.size === size && i.color === color) {
            // Check stock limit if stock information is available
            if (i.stock !== undefined && quantity > i.stock) {
              alert(`Only ${i.stock} units available in stock`)
              return { ...i, quantity: i.stock }
            }
            return { ...i, quantity }
          }
          return i
        })
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
