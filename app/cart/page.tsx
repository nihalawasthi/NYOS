'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = () => {
    setIsProcessing(true)
    setTimeout(() => {
      alert('Checkout functionality coming soon! Stripe integration ready.')
      setIsProcessing(false)
    }, 1500)
  }

  if (items.length === 0) {
    return (
      <main className="bg-stone-50 text-stone-900 min-h-screen">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-stone-50/95 backdrop-blur border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-light tracking-tight">
              <span className="font-semibold">NYOS</span>
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/products" className="text-sm font-light tracking-wide hover:text-stone-600 transition-colors">
                COLLECTION
              </Link>
            </div>
          </div>
        </nav>

        {/* Empty Cart */}
        <div className="max-w-2xl mx-auto px-6 py-32 text-center pt-40">
          <ShoppingBag className="w-16 h-16 mx-auto mb-8 text-stone-300" />
          <h1 className="text-4xl font-light tracking-tight mb-4">Cart is empty</h1>
          <p className="text-lg text-stone-600 font-light mb-12">
            Explore our collection and add something you love.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-8 py-3 font-light tracking-wide transition-all group"
          >
            CONTINUE SHOPPING
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-stone-50 text-stone-900 min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-stone-50/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-light tracking-tight">
            <span className="font-semibold">NYOS</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/products" className="text-sm font-light tracking-wide hover:text-stone-600 transition-colors">
              COLLECTION
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-light tracking-tight">Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex gap-6 pb-6 border-b border-stone-200 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-32 h-32 bg-stone-100 rounded-sm flex-shrink-0 flex items-center justify-center">
                  <div
                    className="w-full h-full rounded-sm"
                    style={{ backgroundColor: item.color || '#e8dfd6' }}
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-light tracking-wide mb-2">
                      {item.name}
                    </h3>
                    <div className="flex gap-4 text-sm text-stone-600 font-light">
                      <span>Size: {item.size || 'M'}</span>
                      <span>
                        Color: <span
                          className="inline-block w-4 h-4 rounded-sm border border-stone-300 align-middle ml-1"
                          style={{ backgroundColor: item.color || '#e8dfd6' }}
                        />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 border border-stone-300 rounded-sm p-1 w-fit">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="p-1 hover:bg-stone-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-light">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="p-1 hover:bg-stone-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-light mb-2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-stone-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-stone-200 rounded-sm p-8 sticky top-24 space-y-6">
              <h2 className="text-xl font-light tracking-wide">Order Summary</h2>

              <div className="space-y-3 border-t border-b border-stone-200 py-4">
                <div className="flex justify-between text-sm font-light">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-light text-stone-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm font-light text-stone-600">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-light">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-600 text-white py-3 font-light tracking-wide transition-all active:scale-95"
              >
                {isProcessing ? 'Processing...' : 'PROCEED TO CHECKOUT'}
              </button>

              <button
                onClick={() => {
                  clearCart()
                }}
                className="w-full border border-stone-300 hover:bg-stone-50 py-3 font-light tracking-wide transition-all rounded-sm"
              >
                CLEAR CART
              </button>

              <Link
                href="/products"
                className="block text-center text-sm font-light text-stone-600 hover:text-stone-900 transition-colors"
              >
                Continue Shopping
              </Link>

              <div className="pt-4 border-t border-stone-200 text-xs text-stone-600 font-light space-y-2">
                <p>✓ Free shipping on orders over $100</p>
                <p>✓ Easy returns within 30 days</p>
                <p>✓ Secure checkout powered by Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
