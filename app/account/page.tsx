'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getOrders } from '@/lib/api'
import { Navigation } from '@/components/navigation'
import type { Order } from '@/lib/api'
import { LogOut, ShoppingBag } from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    setUser(JSON.parse(userData))
    
    const loadOrders = async () => {
      const ordersData = await getOrders()
      setOrders(ordersData)
      setLoading(false)
    }
    
    loadOrders()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <main className="bg-stone-50 text-stone-900 min-h-screen">
      <Navigation />

      <div className="pt-24 pb-12 px-6 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-light tracking-tight">My Account</h1>
          <p className="text-lg text-stone-600 font-light mt-2">Welcome, {user.name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Account Info */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-stone-200 rounded-sm p-8 space-y-4">
              <h2 className="text-xl font-light tracking-wide">Account Details</h2>
              <div className="space-y-3 border-t border-stone-200 pt-4">
                <div>
                  <p className="text-xs text-stone-600 font-light">Name</p>
                  <p className="font-light">{user.name}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-600 font-light">Email</p>
                  <p className="font-light">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-stone-600 font-light">User ID</p>
                  <p className="font-light font-mono text-sm">{user.id}</p>
                </div>
                {user.isAdmin && (
                  <div className="bg-amber-50 border border-amber-200 rounded px-3 py-2 mt-2">
                    <p className="text-xs font-light text-amber-900">👑 Admin Account</p>
                  </div>
                )}
              </div>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white py-3 font-light tracking-wide transition-all rounded-sm mt-4"
                >
                  ADMIN DASHBOARD
                </Link>
              )}
              <Link
                href="/products"
                className="block w-full text-center bg-stone-900 hover:bg-stone-800 text-white py-3 font-light tracking-wide transition-all rounded-sm mt-4"
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-stone-200 rounded-sm p-8">
              <h2 className="text-xl font-light tracking-wide mb-6">Order History</h2>
              
              {loading ? (
                <p className="text-stone-600 font-light">Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 mb-4" />
                  <p className="text-stone-600 font-light mb-6">No orders yet</p>
                  <Link
                    href="/products"
                    className="inline-block bg-stone-900 hover:bg-stone-800 text-white px-8 py-3 font-light tracking-wide transition-all rounded-sm"
                  >
                    START SHOPPING
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stone-200">
                        <th className="text-left py-3 px-4 text-sm font-light">Order ID</th>
                        <th className="text-left py-3 px-4 text-sm font-light">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-light">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-light">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-light">Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-stone-100 hover:bg-stone-50">
                          <td className="py-3 px-4 text-sm font-light text-stone-600">{order.id.slice(0, 8)}</td>
                          <td className="py-3 px-4 text-sm font-light">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm font-light">₹{order.totalAmount.toFixed(0)}</td>
                          <td className="py-3 px-4 text-sm font-light">
                            <span className="px-2 py-1 bg-blue-100 rounded-sm text-xs capitalize text-blue-700">
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm font-light">
                            <span className={`px-2 py-1 rounded-sm text-xs capitalize ${
                              order.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
