'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Heart, Share2, ChevronLeft, Check } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

const PRODUCTS = [
  {
    id: 1,
    name: 'Essential Minimalist',
    price: 89,
    category: 'Essential',
    colors: ['#1a1a1a', '#ffffff', '#e8dfd6'],
    description: 'Pure elegance in simplicity',
    fullDescription: 'The foundation of any wardrobe. Crafted from premium organic cotton with precision stitching. Timeless design that transcends seasonal trends.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 45,
    rating: 4.9,
    reviews: 234,
    features: ['100% Organic Cotton', 'Ethically Produced', 'Premium Stitching', 'Preshrunk'],
  },
  {
    id: 2,
    name: 'Drift Series',
    price: 99,
    category: 'Premium',
    colors: ['#4a4a4a', '#8b8680', '#d4cdc5'],
    description: 'Soft, refined tones',
    fullDescription: 'Elevated comfort meets sophisticated design. Our Drift Series uses premium cotton blend with enhanced durability. Perfect for those who appreciate subtlety.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 28,
    rating: 4.8,
    reviews: 189,
    features: ['Premium Cotton Blend', 'Reinforced Seams', 'Fade Resistant', 'Expert Crafted'],
  },
  {
    id: 3,
    name: 'Canvas Premium',
    price: 109,
    category: 'Premium',
    colors: ['#2c2c2c', '#666666', '#a8a29d'],
    description: 'Luxury redefined',
    fullDescription: 'Our most luxurious offering. Constructed from the finest certified organic cotton with professional-grade finishing. Limited production.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 12,
    rating: 4.95,
    reviews: 156,
    features: ['Certified Organic', 'Limited Production', 'Museum Quality', 'Lifetime Warranty'],
  },
  {
    id: 4,
    name: 'Neutral Standard',
    price: 79,
    category: 'Essential',
    colors: ['#f0ede8', '#999999', '#5a5a5a'],
    description: 'Timeless versatility',
    fullDescription: 'The essential everyday piece. High-quality construction meets accessible pricing. Designed for maximum versatility.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    stock: 67,
    rating: 4.7,
    reviews: 312,
    features: ['Quality Cotton', 'Easy Care', 'Great Value', 'Versatile Design'],
  },
]

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [id, setId] = React.useState<string | null>(null)

  React.useEffect(() => {
    params.then((p) => {
      setId(p.id)
      setIsLoading(false)
    })
  }, [params])

  const [customization, setCustomization] = useState({
    color: '',
    size: 'M',
    quantity: 1,
  })
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showAddedMessage, setShowAddedMessage] = useState(false)
  const { addItem } = useCart()

  if (isLoading || !id) {
    return <div>Loading...</div>
  }

  const product = PRODUCTS.find((p) => p.id === Number(id))

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
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      color: customization.color,
      size: customization.size,
      quantity: customization.quantity,
    })
    setShowAddedMessage(true)
    setTimeout(() => setShowAddedMessage(false), 2000)
  }

  const selectedColor = customization.color || product.colors[0]

  return (
    <main className="bg-stone-50 text-stone-900">
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
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="p-2 hover:bg-stone-100 rounded-sm transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-stone-600'}`} />
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
                ${product.price}
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
                  onClick={() => setCustomization({ ...customization, quantity: customization.quantity + 1 })}
                  className="w-8 h-8 flex items-center justify-center hover:bg-stone-100 rounded-sm"
                >
                  +
                </button>
              </div>
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

        {/* Related Products */}
        <div className="mt-24 pt-12 border-t border-stone-200">
          <h2 className="text-3xl font-light tracking-tight mb-12">Related Products</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3).map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.id}`}
                className="group"
              >
                <div className="bg-stone-100 rounded-sm aspect-square mb-4 group-hover:bg-stone-200 transition-colors flex items-center justify-center">
                  <Product3D color={relatedProduct.colors[0]} />
                </div>
                <h3 className="font-light tracking-wide group-hover:text-stone-600 transition-colors">
                  {relatedProduct.name}
                </h3>
                <p className="text-sm text-stone-600 font-light mb-3">
                  {relatedProduct.description}
                </p>
                <div className="text-lg font-light">${relatedProduct.price}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
