'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'
const CurtainHeroWrapper = dynamic(() => import('@/components/curtain'), {
  ssr: false,
})

const PRODUCTS = [
  {
    id: 1,
    name: 'Essential Minimalist',
    price: 899,
    colors: ['#1a1a1a', '#ffffff', '#e8dfd6'],
    description: 'Pure elegance in simplicity',
  },
  {
    id: 2,
    name: 'Drift Series',
    price: 999,
    colors: ['#4a4a4a', '#8b8680', '#d4cdc5'],
    description: 'Soft, refined tones',
  },
  {
    id: 3,
    name: 'Canvas Premium',
    price: 1099,
    colors: ['#2c2c2c', '#666666', '#a8a29d'],
    description: 'Luxury redefined',
  },
  {
    id: 4,
    name: 'Neutral Standard',
    price: 799,
    colors: ['#f0ede8', '#999999', '#5a5a5a'],
    description: 'Timeless versatility',
  },
]

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0])
  const [selectedColor, setSelectedColor] = useState(PRODUCTS[0].colors[0])
  const [cartCount, setCartCount] = useState(0)
  const [showNotification, setShowNotification] = useState(false)

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 2000)
  }

  return (
    <main className="bg-stone-50 text-stone-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-stone-50/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-light tracking-tight">
            <img className="max-h-16" src="/logo.png" alt="NYOS Logo" />
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/products" className="text-sm font-light tracking-wide hover:text-stone-600 transition-colors">
              COLLECTION
            </Link>
            <Link href="#" className="text-sm font-light tracking-wide hover:text-stone-600 transition-colors">
              ABOUT
            </Link>
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-5 h-5 text-stone-900 hover:text-stone-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Curtain + Hero Combined Section */}
      <CurtainHeroWrapper />

      {/* Statement Section */}
      <section className="py-24 px-6 border-t border-stone-200">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6">
            Elevated Essentials
          </h1>
          <p className="text-lg text-stone-600 font-light leading-relaxed max-w-2xl mx-auto mb-12">
            Meticulously crafted tees that balance minimalism with premium quality. Each piece designed to become a wardrobe staple.
          </p>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-24 px-6 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            {/* Product Image */}
            <div className="animate-fade-in-up">
              <div className="bg-stone-100 rounded-sm overflow-hidden h-96 mb-8 flex items-center justify-center">
                <img 
                  src={`/placeholder.svg?height=400&width=400`}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Color Selector */}
              <div className="flex gap-4 mb-8">
                {selectedProduct.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-sm transition-all border-2 ${
                      selectedColor === color
                        ? 'border-stone-900 scale-110'
                        : 'border-stone-300 hover:border-stone-400'
                    }`}
                    style={{ backgroundColor: color }}
                    title={`Color: ${color}`}
                  />
                ))}
              </div>

              {/* Product Info */}
              <div className="space-y-4 mb-8">
                <div>
                  <h2 className="text-3xl font-light tracking-tight mb-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-stone-600 font-light">
                    {selectedProduct.description}
                  </p>
                </div>
                <div className="text-2xl font-light">
                  ₹{selectedProduct.price}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 px-6 font-light tracking-wide transition-all active:scale-95"
              >
                ADD TO CART
              </button>

              {showNotification && (
                <div className="mt-4 p-3 bg-stone-100 border border-stone-300 text-sm text-stone-700 font-light animate-fade-in-up">
                  Added to cart ✓
                </div>
              )}
            </div>

            {/* Product Selection Grid */}
            <div className="grid grid-cols-2 gap-4">
              {PRODUCTS.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product)
                    setSelectedColor(product.colors[0])
                  }}
                  className={`p-6 rounded-sm transition-all text-left group ${
                    selectedProduct.id === product.id
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-900'
                  }`}
                >
                  <div className="flex gap-2 mb-4">
                    {product.colors.map((color) => (
                      <div
                        key={color}
                        className="w-5 h-5 rounded-sm border border-stone-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <h3 className="font-light text-sm tracking-wide mb-2">{product.name}</h3>
                  <p className={`text-sm font-light mb-3 ${
                    selectedProduct.id === product.id
                      ? 'text-white/70'
                      : 'text-stone-600'
                  }`}>
                    {product.description}
                  </p>
                  <div className="text-lg font-light">₹{product.price}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-2">
              <div className="text-sm font-semibold tracking-widest text-stone-600 mb-4">
                QUALITY
              </div>
              <p className="text-lg font-light text-stone-700">
                Premium organic cotton with precision stitching for longevity
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold tracking-widest text-stone-600 mb-4">
                SUSTAINABILITY
              </div>
              <p className="text-lg font-light text-stone-700">
                Ethical production and eco-friendly packaging throughout
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold tracking-widest text-stone-600 mb-4">
                DESIGN
              </div>
              <p className="text-lg font-light text-stone-700">
                Minimalist aesthetics that transcend seasonal trends
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white border-t border-stone-200">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-light tracking-tight">
            Discover the Collection
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-8 py-3 font-light tracking-wide transition-all group"
          >
            SHOP NOW
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-100 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12 pb-12 border-b border-stone-800">
            <div>
              <h4 className="text-sm font-semibold tracking-widest mb-6">SHOP</h4>
              <ul className="space-y-3">
                <li><a href="/products" className="font-light hover:text-stone-300 transition-colors">All Collections</a></li>
                <li><a href="#" className="font-light hover:text-stone-300 transition-colors">New Arrivals</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-widest mb-6">SUPPORT</h4>
              <ul className="space-y-3">
                <li><a href="#" className="font-light hover:text-stone-300 transition-colors">Contact</a></li>
                <li><a href="#" className="font-light hover:text-stone-300 transition-colors">Shipping Info</a></li>
                <li><a href="#" className="font-light hover:text-stone-300 transition-colors">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-widest mb-6">COMPANY</h4>
              <ul className="space-y-3">
                <li><a href="#" className="font-light hover:text-stone-300 transition-colors">About Us</a></li>
                <li><a href="#" className="font-light hover:text-stone-300 transition-colors">Sustainability</a></li>
                <li><a href="#" className="font-light hover:text-stone-300 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-widest mb-6">CONNECT</h4>
              <ul className="space-y-3">
                <li><a href="#" className="font-light hover:text-stone-300 transition-colors">Instagram</a></li>
                <li><a href="#" className="font-light hover:text-stone-300 transition-colors">Twitter</a></li>
                <li><a href="#" className="font-light hover:text-stone-300 transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-stone-400 font-light text-sm">
            <p>&copy; 2024 FIBER. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
