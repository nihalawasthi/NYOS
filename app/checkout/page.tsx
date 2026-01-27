'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { createOrder } from '@/lib/api'
import { ArrowLeft, Check } from 'lucide-react'
import { Navigation } from '@/components/navigation'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  })

  if (items.length === 0 && !orderPlaced) {
    return (
      <main className="bg-stone-50 text-stone-900 min-h-screen">
        <Navigation />

        <div className="max-w-2xl mx-auto px-6 py-32 text-center pt-40">
          <h1 className="text-4xl font-light tracking-tight mb-4">Cart is empty</h1>
          <p className="text-lg text-stone-600 font-light mb-12">
            Add items to your cart before checking out.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-8 py-3 font-light tracking-wide"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </main>
    )
  }

  if (orderPlaced) {
    return (
      <main className="bg-stone-50 text-stone-900 min-h-screen">
        <Navigation />

        <div className="max-w-2xl mx-auto px-6 py-32 text-center pt-40">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-8">
            <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl font-light tracking-tight mb-4">Order Placed!</h1>
            <p className="text-lg text-stone-600 font-light mb-4">
              Thank you for your purchase.
            </p>
            <p className="text-sm text-stone-600 font-light mb-6">
              Order ID: <span className="font-semibold text-stone-900">{orderId}</span>
            </p>
            <p className="text-sm text-stone-600 font-light mb-8">
              A confirmation email has been sent to your email address.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="block bg-stone-900 hover:bg-stone-800 text-white px-8 py-3 font-light tracking-wide"
            >
              BACK TO HOME
            </Link>
            <Link
              href="/products"
              className="block border border-stone-300 hover:bg-stone-50 px-8 py-3 font-light tracking-wide"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.customerName || !formData.customerEmail || !formData.street || !formData.city) {
      alert('Please fill in all required fields')
      return
    }

    setIsProcessing(true)

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        totalAmount: total,
      }

      const order = await createOrder(orderData)

      if (order) {
        setOrderId(order.id)
        setOrderPlaced(true)
        clearCart()
      } else {
        alert('Failed to create order. Please try again.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('An error occurred during checkout.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="bg-stone-50 text-stone-900 min-h-screen">
      <Navigation />

      <div className="pt-24 pb-12 px-6 border-b border-stone-200">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-6 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">Checkout</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white border border-stone-200 rounded-sm p-8">
                <h2 className="text-xl font-light tracking-wide mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-light mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2">Email *</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2">Phone</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white border border-stone-200 rounded-sm p-8">
                <h2 className="text-xl font-light tracking-wide mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-light mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-light mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white border border-stone-200 rounded-sm p-8">
                <h2 className="text-xl font-light tracking-wide mb-6">Payment</h2>
                <div className="p-4 bg-stone-50 rounded-sm border border-stone-200 text-sm font-light text-stone-600 mb-6">
                  <p>🔒 Secure payment powered by Stripe</p>
                  <p className="text-xs mt-2 text-stone-500">Full payment processing coming soon. For now, orders are placed with pending payment status.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-600 text-white py-3 font-light tracking-wide transition-all active:scale-95 rounded-sm"
              >
                {isProcessing ? 'PROCESSING...' : `PLACE ORDER - ₹${total.toFixed(0)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-stone-200 rounded-sm p-8 sticky top-24">
              <h2 className="text-xl font-light tracking-wide mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm font-light border-b border-stone-100 pb-4">
                    <div>
                      <p className="font-light">{item.name}</p>
                      <p className="text-xs text-stone-600">{item.quantity}x • {item.size}</p>
                    </div>
                    <p>₹{(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-b border-stone-200 py-4 mb-6">
                <div className="flex justify-between text-sm font-light">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm font-light text-stone-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm font-light text-stone-600">
                  <span>Tax</span>
                  <span>Included</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-light mb-6">
                <span>Total</span>
                <span>₹{total.toFixed(0)}</span>
              </div>

              <div className="text-xs text-stone-600 font-light space-y-2">
                <p>✓ Free shipping on all orders</p>
                <p>✓ Easy returns within 30 days</p>
                <p>✓ 100% secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
