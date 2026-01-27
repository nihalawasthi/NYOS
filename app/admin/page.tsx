'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getProducts, getOrders } from '@/lib/api'
import { Navigation } from '@/components/navigation'
import type { Product, Order } from '@/lib/api'
import { BarChart3, ShoppingBag, Package } from 'lucide-react'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check if user is admin
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      if (!userData.isAdmin) {
        window.location.href = '/'
        return
      }
      setIsAdmin(true)
    } else {
      window.location.href = '/login'
      return
    }

    const loadData = async () => {
      const [prods, ords] = await Promise.all([getProducts(), getOrders()])
      setProducts(prods)
      setOrders(ords)
      setLoading(false)
    }
    loadData()
  }, [])

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalOrders = orders.length
  const totalProducts = products.length

  if (loading) {
    return (
      <main className="bg-stone-50 text-stone-900 min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </main>
    )
  }

  if (!isAdmin) {
    return (
      <main className="bg-stone-50 text-stone-900 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-6xl font-light mb-4">404</h1>
          <p className="text-xl text-stone-600 font-light mb-8">Page Not Found</p>
          <a href="/" className="inline-block bg-stone-900 text-white px-8 py-3 font-light tracking-wide hover:bg-stone-800 rounded-sm">
            BACK HOME
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-stone-50 text-stone-900 min-h-screen">
      <Navigation />

      <div className="pt-24 pb-12 px-6 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-light tracking-tight">Admin Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-stone-200 rounded-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-light text-stone-600">Total Revenue</h3>
                  <BarChart3 className="w-5 h-5 text-stone-400" />
                </div>
                <p className="text-3xl font-light">₹{totalRevenue.toFixed(0)}</p>
              </div>

              <div className="bg-white border border-stone-200 rounded-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-light text-stone-600">Total Orders</h3>
                  <ShoppingBag className="w-5 h-5 text-stone-400" />
                </div>
                <p className="text-3xl font-light">{totalOrders}</p>
              </div>

              <div className="bg-white border border-stone-200 rounded-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-light text-stone-600">Total Products</h3>
                  <Package className="w-5 h-5 text-stone-400" />
                </div>
                <p className="text-3xl font-light">{totalProducts}</p>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-sm p-6">
              <h2 className="text-xl font-light tracking-wide mb-6">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="text-left py-3 px-4 text-sm font-light">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-light">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-light">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-light">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-light">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-stone-100">
                        <td className="py-3 px-4 text-sm font-light text-stone-600">{order.id.slice(0, 8)}</td>
                        <td className="py-3 px-4 text-sm font-light">{order.customerName}</td>
                        <td className="py-3 px-4 text-sm font-light">₹{order.totalAmount.toFixed(0)}</td>
                        <td className="py-3 px-4 text-sm font-light">
                          <span className="px-2 py-1 bg-stone-100 rounded-sm text-xs capitalize">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-light text-stone-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white border border-stone-200 rounded-sm p-6">
            <h2 className="text-xl font-light tracking-wide mb-6">Products Inventory</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-3 px-4 text-sm font-light">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Stock</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-stone-100">
                      <td className="py-3 px-4 text-sm font-light">{product.name}</td>
                      <td className="py-3 px-4 text-sm font-light text-stone-600">{product.category}</td>
                      <td className="py-3 px-4 text-sm font-light">₹{product.price.toFixed(0)}</td>
                      <td className="py-3 px-4 text-sm font-light">
                        <span className={product.stock > 10 ? 'text-green-600' : 'text-orange-600'}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-light">⭐ {product.rating.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white border border-stone-200 rounded-sm p-6">
            <h2 className="text-xl font-light tracking-wide mb-6">All Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-3 px-4 text-sm font-light">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Payment</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-3 px-4 text-sm font-light text-stone-600">{order.id.slice(0, 8)}</td>
                      <td className="py-3 px-4 text-sm font-light">{order.customerName}</td>
                      <td className="py-3 px-4 text-sm font-light text-stone-600">{order.customerEmail}</td>
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
                      <td className="py-3 px-4 text-sm font-light text-stone-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
