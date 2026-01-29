'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getProducts, getOrders } from '@/lib/api'
import { Navigation } from '@/components/navigation'
import type { Product, Order } from '@/lib/api'
import { BarChart3, ShoppingBag, Package, Plus, Edit, Trash2, X } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAdmin, setIsAdmin] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    fullDescription: '',
    stock: '',
    colors: '',
    sizes: '',
    features: '',
    image: '',
  })

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

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
  const totalOrders = orders.length
  const totalProducts = products.length

  const handleAddProduct = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      price: '',
      category: '',
      description: '',
      fullDescription: '',
      stock: '',
      colors: '',
      sizes: '',
      features: '',
      image: '',
    })
    setShowProductModal(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      fullDescription: product.fullDescription,
      stock: product.stock.toString(),
      colors: product.colors.join(', '),
      sizes: product.sizes.join(', '),
      features: product.features.join(', '),
      image: product.image || '',
    })
    setShowProductModal(true)
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id))
        alert('Product deleted successfully')
      } else {
        alert(`Failed to delete product: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert(`Failed to delete product: ${error instanceof Error ? error.message : 'Network error - backend server may not be running'}`)
    }
  }

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      fullDescription: formData.fullDescription,
      stock: parseInt(formData.stock),
      colors: formData.colors.split(',').map((c) => c.trim()),
      sizes: formData.sizes.split(',').map((s) => s.trim()),
      features: formData.features.split(',').map((f) => f.trim()),
      image: formData.image,
      rating: editingProduct?.rating || 4.5,
      reviews: editingProduct?.reviews || 0,
    }

    try {
      const url = editingProduct
        ? `${API_BASE}/products/${editingProduct.id}`
        : `${API_BASE}/products`
      const method = editingProduct ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (res.ok) {
        const result = await res.json()
        if (editingProduct) {
          setProducts(products.map((p) => (p.id === editingProduct.id ? result.data : p)))
        } else {
          setProducts([...products, result.data])
        }
        setShowProductModal(false)
        alert(editingProduct ? 'Product updated successfully' : 'Product added successfully')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product')
    }
  }

  const handleApproveOrder = async (orderId: string) => {
    if (!confirm('Approve this order? Stock will be deducted.')) return

    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/approve`, {
        method: 'POST',
      })

      const result = await res.json()

      if (res.ok) {
        setOrders(orders.map((o) => (o.id === orderId ? result.data : o)))
        // Refresh products to update stock
        const prods = await getProducts()
        setProducts(prods)
        alert('Order approved and stock deducted')
      } else {
        alert(`Failed to approve order: ${result.error}\n${result.details?.join('\n') || ''}`)
      }
    } catch (error) {
      console.error('Error approving order:', error)
      alert('Failed to approve order')
    }
  }

  const handleRejectOrder = async (orderId: string) => {
    const reason = prompt('Enter rejection reason (optional):')
    if (reason === null) return // User cancelled

    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      if (res.ok) {
        const result = await res.json()
        setOrders(orders.map((o) => (o.id === orderId ? result.data : o)))
        alert('Order rejected')
      }
    } catch (error) {
      console.error('Error rejecting order:', error)
      alert('Failed to reject order')
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        const result = await res.json()
        setOrders(orders.map((o) => (o.id === orderId ? result.data : o)))
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    }
  }

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

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex gap-1 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 text-sm font-light tracking-wide transition-colors ${
              activeTab === 'dashboard'
                ? 'border-b-2 border-stone-900 text-stone-900'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 text-sm font-light tracking-wide transition-colors ${
              activeTab === 'products'
                ? 'border-b-2 border-stone-900 text-stone-900'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 text-sm font-light tracking-wide transition-colors ${
              activeTab === 'orders'
                ? 'border-b-2 border-stone-900 text-stone-900'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Orders
          </button>
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
                        <td className="py-3 px-4 text-sm font-light">₹{Number(order.totalAmount).toFixed(0)}</td>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-light tracking-wide">Products Inventory</h2>
              <button
                onClick={handleAddProduct}
                className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-sm text-sm font-light transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-3 px-4 text-sm font-light">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Stock</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Rating</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Actions</th>
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
                      <td className="py-3 px-4 text-sm font-light">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 hover:bg-stone-100 rounded-sm transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-stone-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 hover:bg-red-50 rounded-sm transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
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
                    <th className="text-left py-3 px-4 text-sm font-light">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Payment</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-light">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="py-3 px-4 text-sm font-light text-stone-600">{order.id.slice(0, 8)}</td>
                      <td className="py-3 px-4 text-sm font-light">
                        <div>
                          <div>{order.customerName}</div>
                          <div className="text-xs text-stone-500">{order.customerEmail}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-light">₹{Number(order.totalAmount).toFixed(0)}</td>
                      <td className="py-3 px-4 text-sm font-light">
                        {order.status === 'pending' ? (
                          <span className="px-2 py-1 bg-orange-100 rounded-sm text-xs capitalize text-orange-700">
                            {order.status}
                          </span>
                        ) : order.status === 'rejected' || order.status === 'cancelled' ? (
                          <span className="px-2 py-1 bg-red-100 rounded-sm text-xs capitalize text-red-700">
                            {order.status}
                          </span>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="px-2 py-1 border border-stone-300 rounded-sm text-xs capitalize"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        )}
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
                      <td className="py-3 px-4 text-sm font-light">
                        {order.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveOrder(order.id)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-sm text-xs transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectOrder(order.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-sm text-xs transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-200 flex justify-between items-center">
              <h3 className="text-xl font-light tracking-wide">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => {
                  setShowProductModal(false)
                  setEditingProduct(null)
                }}
                className="p-2 hover:bg-stone-100 rounded-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitProduct} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-light mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-stone-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-light mb-2">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-stone-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light mb-2">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-stone-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-stone-500"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Essential">Essential</option>
                    <option value="Premium">Premium</option>
                    <option value="Limited">Limited</option>
                    <option value="Seasonal">Seasonal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-stone-500 h-20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Full Description</label>
                  <textarea
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-stone-500 h-32"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Colors (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="Black, White, Navy"
                    className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="XS, S, M, L, XL"
                    className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Features (comma-separated)</label>
                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Feature 1, Feature 2, Feature 3"
                    className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-stone-500 h-20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/product.jpg"
                    className="w-full px-4 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-stone-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false)
                    setEditingProduct(null)
                  }}
                  className="px-6 py-2 border border-stone-300 hover:bg-stone-50 rounded-sm text-sm font-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-sm text-sm font-light transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
