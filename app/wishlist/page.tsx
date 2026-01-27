'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { ProductCard } from '@/components/ProductCard'
import { getProducts } from '@/lib/api'
import { useWishlist } from '@/lib/wishlist-context'
import { Heart } from 'lucide-react'
import type { Product } from '@/lib/api'

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { items } = useWishlist()

  useEffect(() => {
    const loadProducts = async () => {
      const allProducts = await getProducts()
      const wishlistProducts = allProducts.filter(p => items.some(item => item.productId === p.id))
      setProducts(wishlistProducts)
      setLoading(false)
    }
    loadProducts()
  }, [items])

  return (
    <main className="bg-stone-50 text-stone-900 min-h-screen">
      <Navigation />

      <div className="pt-24 pb-12 px-6 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-light tracking-tight">My Wishlist</h1>
          <p className="text-lg text-stone-600 font-light mt-2">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-stone-300 mb-4" />
            <p className="text-xl text-stone-600 font-light mb-6">Your wishlist is empty</p>
            <Link
              href="/products"
              className="inline-block bg-stone-900 hover:bg-stone-800 text-white px-8 py-3 font-light tracking-wide transition-all rounded-sm"
            >
              EXPLORE PRODUCTS
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
