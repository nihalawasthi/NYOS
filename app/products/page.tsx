'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { getProducts } from '@/lib/api'
import { Navigation } from '@/components/navigation'
import { ProductCard } from '@/components/ProductCard'
import type { Product } from '@/lib/api'

const CATEGORIES = ['All', 'Essential', 'Premium', 'Limited', 'Seasonal']
const PRICE_RANGES = [
  { label: '₹0 - ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000+', min: 1000, max: Infinity },
]

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
      setLoading(false)
    }
    loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                           product.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const matchesPrice = !selectedPriceRange || 
                          (product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max)
      
      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [products, search, selectedCategory, selectedPriceRange])

  return (
    <main className="bg-stone-50 text-stone-900 min-h-screen">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <div className="pt-24 pb-12 px-6 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-light tracking-tight mb-4">Collection</h1>
          <p className="text-lg text-stone-600 font-light">
            Carefully curated essentials for the discerning minimalist
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="sticky top-16 z-40 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-4 items-center mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
              <input
                type="text"
                placeholder="Search collection..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-sm bg-stone-50 font-light placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-stone-300 rounded-sm font-light hover:bg-stone-50 transition-colors"
            >
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid md:grid-cols-2 gap-6 pb-4 border-t border-stone-200 pt-4">
              <div>
                <h3 className="text-sm font-semibold tracking-widest text-stone-600 mb-3">CATEGORY</h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 text-sm font-light rounded-sm transition-all ${
                        selectedCategory === cat
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 hover:bg-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-widest text-stone-600 mb-3">PRICE</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedPriceRange(null)}
                    className={`px-4 py-2 text-sm font-light rounded-sm transition-all ${
                      selectedPriceRange === null
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 hover:bg-stone-200'
                    }`}
                  >
                    All Prices
                  </button>
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceRange(range)}
                      className={`px-4 py-2 text-sm font-light rounded-sm transition-all ${
                        selectedPriceRange?.label === range.label
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 hover:bg-stone-200'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-stone-600 font-light mb-4">
              No products found
            </p>
            <button
              onClick={() => {
                setSearch('')
                setSelectedCategory('All')
                setSelectedPriceRange(null)
              }}
              className="px-6 py-2 border border-stone-300 rounded-sm font-light hover:bg-stone-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

function Loading() {
  return null
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductsContent />
    </Suspense>
  )
}
