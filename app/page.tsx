'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { ShoppingCart, ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import StatementSection from '@/components/Statement'
import ProductSection from '@/components/Product'
import { useCart } from '@/lib/cart-context'
import { ParallaxProvider, useParallax } from 'react-scroll-parallax'
const CurtainHeroWrapper = dynamic(() => import('@/components/curtain'), {
  ssr: false,
})

// Statement Section Component


export default function Home() {
  const { cartCount } = useCart()
  const mainRef = useRef(null)


  return (
    <main className="bg-stone-50 text-stone-900" ref={mainRef}>
      <ParallaxProvider>
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

        {/* Curtain + Hero Combined */}
        <CurtainHeroWrapper />

        {/* Statement Section */}
        <StatementSection />

        {/* Product Showcase */}
        <ProductSection />
        
        {/* Footer */}
        <footer className="bg-black text-stone-100 py-16 px-6">
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
              <p>&copy; 2025 NYOS All rights reserved.</p>
            </div>
          </div>
        </footer>
      </ParallaxProvider>
    </main>
  )
}
