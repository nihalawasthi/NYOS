'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, User, LogOut, Menu, X, Heart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { useRouter } from 'next/navigation'

export function Navigation() {
  const { itemCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setMobileOpen(false)
    router.push('/')
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-stone-50/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-light tracking-tight">
          <span className="font-semibold">NYOS</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-sm font-light tracking-wide hover:text-stone-600 transition-colors">
            COLLECTION
          </Link>
          <Link href="#" className="text-sm font-light tracking-wide hover:text-stone-600 transition-colors">
            ABOUT
          </Link>

          {/* Wishlist */}
          <Link href="/wishlist" className="relative">
            <Heart className="w-5 h-5 text-stone-900 hover:text-stone-600 transition-colors" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-5 h-5 text-stone-900 hover:text-stone-600 transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* Auth Links */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/account"
                className="flex items-center gap-2 text-sm font-light hover:text-stone-600 transition-colors"
              >
                <User className="w-4 h-4" />
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-light text-stone-600 hover:text-stone-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-light hover:text-stone-600 transition-colors">
                LOGIN
              </Link>
              <Link
                href="/register"
                className="text-sm font-light bg-stone-900 text-white px-4 py-1 rounded-sm hover:bg-stone-800 transition-colors"
              >
                REGISTER
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/wishlist" className="relative">
            <Heart className="w-5 h-5 text-stone-900" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-5 h-5 text-stone-900" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-stone-200 bg-stone-50">
          <div className="px-6 py-4 space-y-3">
            <Link
              href="/products"
              className="block text-sm font-light hover:text-stone-600 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              COLLECTION
            </Link>
            <Link
              href="#"
              className="block text-sm font-light hover:text-stone-600 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              ABOUT
            </Link>
            <Link
              href="/wishlist"
              className="block text-sm font-light hover:text-stone-600 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              WISHLIST
            </Link>

            {user ? (
              <>
                <Link
                  href="/account"
                  className="block text-sm font-light hover:text-stone-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  MY ACCOUNT
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm font-light text-stone-600 hover:text-stone-900 transition-colors"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-sm font-light hover:text-stone-600 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  LOGIN
                </Link>
                <Link
                  href="/register"
                  className="block text-sm font-light bg-stone-900 text-white px-4 py-2 rounded-sm hover:bg-stone-800 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  REGISTER
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
