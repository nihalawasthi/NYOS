'use client'

import React from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export function CartButton() {
  const { itemCount } = useCart()

  return (
    <Link href="/cart" className="relative group">
      <div className="p-2 hover:bg-slate-800 rounded-lg transition-all">
        <ShoppingCart className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" />
        {itemCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            {itemCount > 9 ? '9+' : itemCount}
          </div>
        )}
      </div>
    </Link>
  )
}
