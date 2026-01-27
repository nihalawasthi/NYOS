'use client'

import React from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export function CartButton() {
  const { itemCount } = useCart()

  return (
    <Link href="/cart" className="relative group">
      <div className="p-2 hover:bg-stone-100 rounded-sm transition-all">
        <ShoppingCart className="w-5 h-5 text-stone-900 group-hover:text-stone-600 transition-colors" />
        {itemCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-stone-900 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount > 9 ? '9+' : itemCount}
          </div>
        )}
      </div>
    </Link>
  )
}
