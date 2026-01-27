'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import StatementSection from '@/components/Statement'
import ProductSection from '@/components/Product'
import { Navigation } from '@/components/navigation'
const CurtainHeroWrapper = dynamic(() => import('@/components/curtain'), {
  ssr: false,
})

export default function Home() {
  const mainRef = useRef(null)


  return (
    <main className="bg-stone-50 text-stone-900" ref={mainRef}>
      {/* Navigation */}
      <Navigation />

      {/* Curtain + Hero Combined */}
      <CurtainHeroWrapper />

      {/* Statement Section */}
      <StatementSection />

      {/* Product Showcase */}
      <ProductSection />

      {/* Footer */}
      <footer className="bg-black text-stone-100 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 pb-12 border-b border-stone-800">
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
    </main>
  )
}
