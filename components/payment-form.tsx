'use client'

import React, { useState } from 'react'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { createRazorpayOrder, verifyRazorpayPayment, processCashOnDelivery } from '@/lib/api'

interface PaymentFormProps {
  amount: number
  orderId?: string
  customerName?: string
  customerEmail?: string
  onSuccess: (method: string) => void
  onError: (error: string) => void
}

export function PaymentForm({
  amount,
  orderId,
  customerName,
  customerEmail,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay')

  React.useEffect(() => {
    console.log('Payment form props:', { orderId, amount, customerName, customerEmail })
  }, [orderId, amount, customerName, customerEmail])

  const handleRazorpayPayment = async () => {
    setIsProcessing(true)
    setPaymentError('')

    try {
      // Create order on backend
      const orderData = await createRazorpayOrder(amount, orderId, customerEmail, customerName)

      if (!orderData) {
        throw new Error('Failed to create payment order')
      }

      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true

      script.onload = () => {
        const razorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
          amount: Math.round(amount * 100),
          currency: 'INR',
          order_id: orderData.orderId,
          name: 'NYOS Store',
          description: `Order Payment - ${orderId || 'N/A'}`,
          customer_notify: 1,
          prefill: {
            name: customerName || '',
            email: customerEmail || '',
          },
          handler: async (response: any) => {
            // Verify payment signature
            const verifyResult = await verifyRazorpayPayment(
              orderData.orderId,
              response.razorpay_payment_id,
              response.razorpay_signature,
              orderId
            )

            if (verifyResult?.success) {
              setPaymentSuccess(true)
              onSuccess('razorpay')
            } else {
              throw new Error('Payment verification failed')
            }
          },
          theme: {
            color: '#1c1917',
          },
        }

        const rzp = new (window as any).Razorpay(razorpayOptions)
        rzp.open()
      }

      document.body.appendChild(script)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed'
      setPaymentError(errorMessage)
      onError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCOD = async () => {
    setIsProcessing(true)
    setPaymentError('')

    try {
      if (!orderId) {
        throw new Error('Order ID is missing')
      }

      // Process COD with the order ID
      const result = await processCashOnDelivery(orderId)

      if (result?.success) {
        setPaymentSuccess(true)
        onSuccess('cod')
      } else {
        throw new Error(result?.error || 'Failed to process cash on delivery')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'COD processing failed'
      setPaymentError(errorMessage)
      onError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  if (paymentSuccess) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900 mb-1">Order Placed Successfully</h3>
            <p className="text-sm text-green-700">
              Your order has been placed and is awaiting admin approval. Order ID: {orderId}
            </p>
            <p className="text-xs text-green-600 mt-2">
              {paymentMethod === 'cod' 
                ? 'Payment method: Cash on Delivery'
                : 'Payment method: Razorpay'}
            </p>
            <p className="text-xs text-green-600 mt-1">
              You will be notified once your order is confirmed.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {paymentError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{paymentError}</p>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold text-stone-900">Select Payment Method</h3>

        {/* Razorpay Option */}
        <label className="block p-4 border-2 rounded-lg cursor-pointer transition-all"
               style={{borderColor: paymentMethod === 'razorpay' ? '#1c1917' : '#d6d3d1'}}>
          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="razorpay"
              checked={paymentMethod === 'razorpay'}
              onChange={(e) => setPaymentMethod(e.target.value as 'razorpay' | 'cod')}
              className="mt-1"
            />
            <div>
              <p className="font-semibold text-stone-900">Online Payment (Razorpay)</p>
              <p className="text-sm text-stone-600">Pay instantly using UPI, Cards, or Bank Transfer</p>
            </div>
          </div>
        </label>

        {/* Cash on Delivery Option */}
        <label className="block p-4 border-2 rounded-lg cursor-pointer transition-all"
               style={{borderColor: paymentMethod === 'cod' ? '#1c1917' : '#d6d3d1'}}>
          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value as 'razorpay' | 'cod')}
              className="mt-1"
            />
            <div>
              <p className="font-semibold text-stone-900">Cash on Delivery (COD)</p>
              <p className="text-sm text-stone-600">Pay when you receive your order</p>
            </div>
          </div>
        </label>
      </div>

      <div className="bg-stone-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-stone-600">Amount to Pay</span>
          <span className="text-2xl font-semibold text-stone-900">₹{amount.toFixed(2)}</span>
        </div>
        <p className="text-xs text-stone-500">
          All transactions are secure and encrypted.
        </p>
      </div>

      <button
        onClick={paymentMethod === 'razorpay' ? handleRazorpayPayment : handleCOD}
        disabled={isProcessing}
        className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : paymentMethod === 'razorpay' ? (
          `Pay ₹${amount.toFixed(2)} via Razorpay`
        ) : (
          'Confirm Order - Pay on Delivery'
        )}
      </button>

      <div className="text-xs text-stone-500 text-center">
        <p>🔒 Secure & trusted by thousands</p>
      </div>
    </div>
  )
}
