'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Share2, ChevronLeft, Check, Trash2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { getProduct, getProducts, getProductReviews, createReview, deleteReview } from '@/lib/api'
import { Navigation } from '@/components/navigation'
import type { Product } from '@/lib/api'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [id, setId] = React.useState<string | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  React.useEffect(() => {
    params.then(async (p) => {
      setId(p.id)
      const [prod, prods, revs] = await Promise.all([getProduct(Number(p.id)), getProducts(), getProductReviews(Number(p.id))])
      setProduct(prod)
      setProducts(prods)
      setReviews(revs)
      setIsLoading(false)
    })
  }, [params])

  const [customization, setCustomization] = useState({
    color: '',
    size: 'M',
    quantity: 1,
  })
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const [showAddedMessage, setShowAddedMessage] = useState(false)

  // Initialize color when product is loaded
  useEffect(() => {
    if (product && !customization.color) {
      setCustomization(prev => ({
        ...prev,
        color: product.colors[0]
      }))
    }
  }, [product])

  const handleAddReview = async () => {
    if (!product || !reviewComment.trim()) return
    
    setSubmittingReview(true)
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      const newReview = await createReview(userData.id, product.id, reviewRating, reviewComment)
      if (newReview) {
        setReviews([newReview, ...reviews])
        setReviewComment('')
        setReviewRating(5)
      }
    }
    setSubmittingReview(false)
  }

  const handleDeleteReview = async (reviewId: number) => {
    if (await deleteReview(reviewId)) {
      setReviews(reviews.filter(r => r.id !== reviewId))
    }
  }

  if (isLoading || !id) {
    return <div>Loading...</div>
  }

  if (!product) {
    return (
      <main className="bg-stone-50 text-stone-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-light tracking-tight mb-4">Product not found</h1>
          <Link href="/products" className="text-stone-600 hover:text-stone-900">
            Back to collection
          </Link>
        </div>
      </main>
    )
  }

  const handleAddToCart = () => {
    if (!customization.color) {
      alert('Please select a color')
      return
    }
    
    // Check if requested quantity exceeds stock
    if (customization.quantity > product.stock) {
      alert(`Only ${product.stock} units available in stock`)
      return
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      color: customization.color,
      size: customization.size,
      quantity: customization.quantity,
      stock: product.stock,
    })
    setShowAddedMessage(true)
    setTimeout(() => setShowAddedMessage(false), 2000)
  }

  const selectedColor = customization.color || product.colors[0]

  return (
    <main className="bg-stone-50 text-stone-900">
      {/* Navigation */}
      <Navigation />

      {/* Breadcrumb */}
      <div className="pt-20 px-6 border-b border-stone-200">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-light text-stone-600 hover:text-stone-900 transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Collection
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="sticky top-24 animate-fade-in-up">
            <div className="bg-white border border-stone-200 rounded-sm overflow-hidden aspect-square mb-6 flex items-center justify-center">
              <img 
                src={`/placeholder.svg?height=600&width=600`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Color Selector */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold tracking-widest text-stone-600 mb-3">COLOR</h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCustomization({ ...customization, color })}
                      className={`w-14 h-14 rounded-sm border-2 transition-all ${
                        selectedColor === color
                          ? 'border-stone-900 scale-105'
                          : 'border-stone-300 hover:border-stone-400'
                      }`}
                      style={{ backgroundColor: color }}
                      title={`Color: ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-light tracking-tight mb-2">
                    {product.name}
                  </h1>
                  <p className="text-lg text-stone-600 font-light mb-6">
                    {product.fullDescription}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product.id)}
                    className="p-2 hover:bg-stone-100 rounded-sm transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-stone-600'}`} />
                  </button>
                  <button className="p-2 hover:bg-stone-100 rounded-sm transition-colors">
                    <Share2 className="w-5 h-5 text-stone-600" />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 text-sm font-light text-stone-600 mb-8">
                <span>★★★★★ {product.rating}</span>
                <span>({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="text-3xl font-light mb-8">
                ₹{product.price}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold tracking-widest text-stone-600 mb-4">SIZE</h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setCustomization({ ...customization, size })}
                    className={`py-3 rounded-sm border-2 font-light transition-all text-sm ${
                      customization.size === size
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white border-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-xs text-stone-600 font-light">In stock: {product.stock} units</p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold tracking-widest text-stone-600 mb-4">QUANTITY</h3>
              <div className="flex items-center gap-4 w-fit border border-stone-300 rounded-sm p-2">
                <button
                  onClick={() => setCustomization({ ...customization, quantity: Math.max(1, customization.quantity - 1) })}
                  className="w-8 h-8 flex items-center justify-center hover:bg-stone-100 rounded-sm"
                >
                  −
                </button>
                <span className="w-12 text-center font-light">{customization.quantity}</span>
                <button
                  onClick={() => setCustomization({ ...customization, quantity: Math.min(product.stock, customization.quantity + 1) })}
                  className="w-8 h-8 flex items-center justify-center hover:bg-stone-100 rounded-sm"
                  disabled={customization.quantity >= product.stock}
                >
                  +
                </button>
              </div>
              {customization.quantity >= product.stock && (
                <p className="text-xs text-orange-600 font-light mt-2">Maximum stock reached</p>
              )}
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-stone-900 hover:bg-stone-800 text-white py-4 font-light tracking-wide mb-3 transition-all active:scale-95 text-lg"
            >
              ADD TO CART
            </button>

            {showAddedMessage && (
              <div className="p-4 bg-green-50 border border-green-300 text-green-700 text-center font-light rounded-sm mb-3 flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Added to cart
              </div>
            )}

            {/* Features */}
            <div className="border-t border-stone-200 pt-8 mt-8 space-y-4">
              <h3 className="text-sm font-semibold tracking-widest text-stone-600">FEATURES</h3>
              <ul className="space-y-3">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-light text-stone-700">
                    <span className="w-1.5 h-1.5 bg-stone-900 rounded-full flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Guarantees */}
            <div className="border-t border-stone-200 pt-8 mt-8 grid grid-cols-2 gap-4 text-xs text-stone-600 font-light">
              <div className="space-y-1">
                <p className="font-semibold tracking-widest">Free Returns</p>
                <p>30-day money-back guarantee</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold tracking-widest">Secure Checkout</p>
                <p>Powered by Stripe</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-24 pt-12 border-t border-stone-200">
          <h2 className="text-3xl font-light tracking-tight mb-8">Reviews</h2>
          
          {/* Add Review Form */}
          <div className="mb-12 bg-stone-50 p-6 rounded-sm">
            <h3 className="font-light tracking-wide mb-4">Leave a Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-light mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`text-3xl transition-colors ${star <= reviewRating ? 'text-yellow-500' : 'text-stone-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-light mb-2">Comment</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-stone-900 font-light"
                  rows={4}
                />
              </div>
              <button
                onClick={handleAddReview}
                disabled={submittingReview || !reviewComment.trim()}
                className="bg-stone-900 text-white px-6 py-2 font-light rounded-sm hover:bg-stone-800 disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-stone-600 font-light">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="border-b border-stone-200 pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-light">{review.User?.name || 'Anonymous'}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-stone-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-stone-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-stone-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-stone-700 font-light">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-24 pt-12 border-t border-stone-200">
          <h2 className="text-3xl font-light tracking-tight mb-12">Related Products</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {products.filter((p) => p.id !== product.id).slice(0, 3).map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.id}`}
                className="group"
              >
                <div className="bg-stone-100 rounded-sm aspect-square mb-4 group-hover:bg-stone-200 transition-colors flex items-center justify-center overflow-hidden">
                  <img 
                    src={`/placeholder.svg?height=400&width=400`}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-light tracking-wide group-hover:text-stone-600 transition-colors">
                  {relatedProduct.name}
                </h3>
                <p className="text-sm text-stone-600 font-light mb-3">
                  {relatedProduct.description}
                </p>
                <div className="text-lg font-light">₹{relatedProduct.price}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
