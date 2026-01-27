'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface WishlistItem {
  id: number
  productId: number
}

interface WishlistContextType {
  items: WishlistItem[]
  itemCount: number
  addItem: (productId: number) => void
  removeItem: (productId: number) => void
  isInWishlist: (productId: number) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('wishlist')
    if (saved) {
      setItems(JSON.parse(saved))
    }
  }, [])

  const saveWishlist = (newItems: WishlistItem[]) => {
    setItems(newItems)
    localStorage.setItem('wishlist', JSON.stringify(newItems))
  }

  const addItem = (productId: number) => {
    if (!items.find(item => item.productId === productId)) {
      const newItems = [...items, { id: Date.now(), productId }]
      saveWishlist(newItems)
    }
  }

  const removeItem = (productId: number) => {
    const newItems = items.filter(item => item.productId !== productId)
    saveWishlist(newItems)
  }

  const isInWishlist = (productId: number) => {
    return items.some(item => item.productId === productId)
  }

  return (
    <WishlistContext.Provider value={{ items, itemCount: items.length, addItem, removeItem, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}
