'use client'

import React, { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const CATEGORIES = ['All', 'Essential', 'Premium', 'Limited', 'Seasonal']
const PRICE_RANGES = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100+', min: 100, max: Infinity },
]

const PRODUCTS = [
  {
    id: 1,
    name: 'Essential Minimalist',
    price: 89,
    category: 'Essential',
    colors: ['#1a1a1a', '#ffffff', '#e8dfd6'],
    description: 'Pure elegance in simplicity',
  },
  {
    id: 2,
    name: 'Drift Series',
    price: 99,
    category: 'Premium',
    colors: ['#4a4a4a', '#8b8680', '#d4cdc5'],
    description: 'Soft, refined tones',
  },
  {
    id: 3,
    name: 'Canvas Premium',
    price: 109,
    category: 'Premium',
    colors: ['#2c2c2c', '#666666', '#a8a29d'],
    description: 'Luxury redefined',
  },
  {
    id: 4,
    name: 'Neutral Standard',
    price: 79,
    category: 'Essential',
    colors: ['#f0ede8', '#999999', '#5a5a5a'],
    description: 'Timeless versatility',
  },
  {
    id: 5,
    name: 'Limited Archive',
    price: 129,
    category: 'Limited',
    colors: ['#1a1a1a', '#8b7355', '#d4af37'],
    description: 'Collector\'s edition',
  },
  {
    id: 6,
    name: 'Seasonal Capsule',
    price: 84,
    category: 'Seasonal',
    colors: ['#c4a584', '#a89f97', '#8b8680'],
    description: 'Season-inspired collection',
  },
  {
    id: 7,
    name: 'Studio Classic',
    price: 89,
    category: 'Essential',
    colors: ['#2a2a2a', '#666666', '#cccccc'],
    description: 'Artist studio edition',
  },
  {
    id: 8,
    name: 'Monochrome Elite',
    price: 119,
    category: 'Premium',
    colors: ['#000000', '#808080', '#ffffff'],
    description: 'Sophisticated palette',
  },
]

function ProductsContent() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const searchParams = useSearchParams()

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                           product.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      const matchesPrice = !selectedPriceRange || 
                          (product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max)
      
      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [search, selectedCategory, selectedPriceRange])

  return (
    <main className="bg-stone-50 text-stone-900 min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-stone-50/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-light tracking-tight">
            <span className="font-semibold">NYOS</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/products" className="text-sm font-light tracking-wide text-stone-600">
              COLLECTION
            </Link>
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>

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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                <div className="bg-stone-100 rounded-sm overflow-hidden mb-4 aspect-square flex items-center justify-center hover:bg-stone-200 transition-colors">
                  <div className="w-full h-full flex items-center justify-center text-stone-500 font-light text-sm">
                    <img 
                      src={`/placeholder.svg?height=400&width=400`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-light text-sm tracking-wide group-hover:text-stone-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-stone-600 font-light">
                    {product.description}
                  </p>
                  <div className="flex gap-2 pt-2">
                    {product.colors.map((color) => (
                      <div
                        key={color}
                        className="w-4 h-4 rounded-sm border border-stone-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="text-lg font-light pt-2">
                    ${product.price}
                  </div>
                </div>
              </Link>
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
