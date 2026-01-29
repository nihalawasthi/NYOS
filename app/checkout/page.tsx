'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { createOrder } from '@/lib/api'
import { ArrowLeft, Check, Plus } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { PaymentForm } from '@/components/payment-form'

interface SavedAddress {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  street: string
  city: string
  state: string
  zipCode: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [isHydrated, setIsHydrated] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  })
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    // Get user data from localStorage if logged in
    const userStr = localStorage.getItem('user')
    let defaultName = ''
    let defaultEmail = ''

    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        defaultName = user.name || ''
        defaultEmail = user.email || ''
      } catch (error) {
        console.error('Failed to parse user data:', error)
      }
    }

    // Load saved addresses
    const saved = localStorage.getItem('savedAddresses')
    if (saved) {
      try {
        let addresses = JSON.parse(saved)
        
        // Deduplicate by address content (street + city + zip) but keep existing IDs
        const seen = new Set<string>()
        addresses = addresses.filter((addr: SavedAddress) => {
          const key = `${addr.street}|${addr.city}|${addr.zipCode}`
          if (seen.has(key)) {
            return false
          }
          seen.add(key)
          return true
        })

        // Re-save cleaned list
        localStorage.setItem('savedAddresses', JSON.stringify(addresses))
        
        setSavedAddresses(addresses)
        if (addresses.length > 0) {
          setSelectedAddressId(addresses[0].id)
          setFormData(addresses[0])
        } else {
          setShowNewAddressForm(true)
          setFormData((prev) => ({
            ...prev,
            customerName: defaultName,
            customerEmail: defaultEmail,
          }))
        }
      } catch (error) {
        console.error('Failed to parse saved addresses:', error)
        localStorage.removeItem('savedAddresses')
        setShowNewAddressForm(true)
        setFormData((prev) => ({
          ...prev,
          customerName: defaultName,
          customerEmail: defaultEmail,
        }))
      }
    } else {
      setShowNewAddressForm(true)
      setFormData((prev) => ({
        ...prev,
        customerName: defaultName,
        customerEmail: defaultEmail,
      }))
    }
  }, [isHydrated])

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

  const handleSaveAddress = () => {
    if (!formData.customerName || !formData.customerEmail || !formData.street || !formData.city) {
      alert('Please fill in all required fields')
      return
    }

    const newAddress: SavedAddress = {
      id: Date.now().toString(),
      ...formData,
    }

    const updated = [...savedAddresses, newAddress]
    localStorage.setItem('savedAddresses', JSON.stringify(updated))
    setSavedAddresses(updated)
    setSelectedAddressId(newAddress.id)
    setShowNewAddressForm(false)
  }

  const handleSelectAddress = (address: SavedAddress) => {
    setFormData(address)
    setSelectedAddressId(address.id)
    setShowNewAddressForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.customerName || !formData.customerEmail || !formData.street || !formData.city) {
      alert('Please fill in all required fields')
      return
    }

    setIsProcessing(true)
    try {
      // Always create order first, regardless of address type
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

      console.log('Creating order with data:', orderData)
      const order = await createOrder(orderData)
      console.log('Order created:', order)

      if (!order || !order.id) {
        throw new Error(`Failed to create order. Response: ${JSON.stringify(order)}`)
      }

      console.log('Setting createdOrderId to:', order.id)
      setCreatedOrderId(order.id)

      // Save address if it's new
      if (showNewAddressForm || savedAddresses.length === 0) {
        const newAddress: SavedAddress = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...formData,
        }
        const updated = [...savedAddresses, newAddress]
        localStorage.setItem('savedAddresses', JSON.stringify(updated))
        setSavedAddresses(updated)
        setSelectedAddressId(newAddress.id)
      }

      // Proceed to payment
      setShowPaymentForm(true)
    } catch (error) {
      console.error('Error creating order:', error)
      setPaymentError(error instanceof Error ? error.message : 'Failed to create order')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentSuccess = async (method: string) => {
    try {
      if (createdOrderId) {
        setOrderId(createdOrderId)
        setOrderPlaced(true)
        clearCart()
      }
    } catch (error) {
      console.error('Payment success error:', error)
      setPaymentError('Failed to finalize order')
    }
  }

  const handlePaymentError = (error: string) => {
    setPaymentError(error)
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
            {!showPaymentForm ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information - Always show and editable */}
              <div className="bg-white border border-stone-200 rounded-sm p-8">
                <h2 className="text-xl font-light tracking-wide mb-2">Contact Information</h2>
                {savedAddresses.length > 0 && !showNewAddressForm && (
                  <p className="text-xs text-stone-500 font-light mb-6">Edit details if ordering for someone else</p>
                )}
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

              {/* Saved Addresses */}
              {savedAddresses.length > 0 && !showNewAddressForm && (
                <div className="bg-white border border-stone-200 rounded-sm p-8">
                  <h2 className="text-xl font-light tracking-wide mb-6">Shipping Address</h2>
                  <div className="space-y-3 mb-6">
                    {savedAddresses.map((address) => (
                      <label
                        key={address.id}
                        className={`block p-4 border-2 rounded-sm cursor-pointer transition-all ${
                          selectedAddressId === address.id
                            ? 'border-stone-900 bg-stone-50'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === address.id}
                            onChange={() => handleSelectAddress(address)}
                            className="mt-1"
                          />
                          <div>
                            <p className="font-semibold text-stone-900">{address.street}</p>
                            <p className="text-sm text-stone-600">
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                            {address.customerPhone && (
                              <p className="text-xs text-stone-500 mt-2">Phone: {address.customerPhone}</p>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(true)}
                    className="flex items-center gap-2 text-stone-600 hover:text-stone-900 text-sm font-light transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Use Different Address
                  </button>
                </div>
              )}

              {/* New Address Form */}
              {(showNewAddressForm || savedAddresses.length === 0) && (
                <>
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
                    {savedAddresses.length > 0 && showNewAddressForm && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="text-stone-600 hover:text-stone-900 text-sm font-light mt-6 transition-colors"
                      >
                        Back to Saved Addresses
                      </button>
                    )}
                  </div>

                  {showNewAddressForm && savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSaveAddress}
                      className="w-full bg-stone-100 hover:bg-stone-200 text-stone-900 py-3 font-light tracking-wide transition-all rounded-sm mb-4"
                    >
                      SAVE THIS ADDRESS
                    </button>
                  )}
                </>
              )}

              {/* Payment */}
              <div className="bg-white border border-stone-200 rounded-sm p-8">
                <h2 className="text-xl font-light tracking-wide mb-6">Payment</h2>
                {paymentError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm font-light mb-6">
                    {paymentError}
                  </div>
                )}
                {!showPaymentForm ? (
                  <p className="p-4 bg-stone-50 rounded-sm border border-stone-200 text-sm font-light text-stone-600 mb-6">
                    Click "Place Order" to proceed to payment
                  </p>
                ) : null}
              </div>

              {!showPaymentForm && (
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-600 text-white py-3 font-light tracking-wide transition-all active:scale-95 rounded-sm"
                >
                  {isProcessing ? 'PROCESSING...' : `PLACE ORDER - ₹${total.toFixed(0)}`}
                </button>
              )}
            </form>
            ) : (
              <div className="space-y-8">
                {/* Payment Section When showPaymentForm is true */}
                <div className="bg-white border border-stone-200 rounded-sm p-8">
                  <h2 className="text-xl font-light tracking-wide mb-6">Payment Details</h2>
                  <PaymentForm
                    amount={total}
                    orderId={createdOrderId || undefined}
                    customerName={formData.customerName}
                    customerEmail={formData.customerEmail}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              </div>
            )}
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
