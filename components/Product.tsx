'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const PRODUCTS = [
    {
        id: 1,
        name: 'Essential Minimalist',
        price: 899,
        colors: ['#1a1a1a', '#ffffff', '#e8dfd6'],
        description: 'Pure elegance in simplicity',
    },
    {
        id: 2,
        name: 'Drift Series',
        price: 999,
        colors: ['#4a4a4a', '#8b8680', '#d4cdc5'],
        description: 'Soft, refined tones',
    },
    {
        id: 3,
        name: 'Canvas Premium',
        price: 1099,
        colors: ['#2c2c2c', '#666666', '#a8a29d'],
        description: 'Luxury redefined',
    },
    {
        id: 4,
        name: 'Neutral Standard',
        price: 799,
        colors: ['#f0ede8', '#999999', '#5a5a5a'],
        description: 'Timeless versatility',
    },
]

export default function ProductSection() {
    const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0])
    const [selectedColor, setSelectedColor] = useState(PRODUCTS[0].colors[0])
    const [cartCount, setCartCount] = useState(0)
    const [showNotification, setShowNotification] = useState(false)

    const handleAddToCart = () => {
        setCartCount(prev => prev + 1)
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 2000)
    }
    return (
        <section className="py-24 px-6 bg-white border-b border-stone-200 relative z-0">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                    {/* Product Image */}
                    <div className="animate-fade-in-up">
                        <div className="bg-stone-100 rounded-sm overflow-hidden h-96 mb-8 flex items-center justify-center">
                            <img
                                src={`/Tshirts/tshirt1.png?height=400&width=400`}
                                alt={selectedProduct.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Color Selector */}
                        <div className="flex gap-4 mb-8">
                            {selectedProduct.colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-10 h-10 rounded-sm transition-all border-2 ${selectedColor === color
                                        ? 'border-stone-900 scale-110'
                                        : 'border-stone-300 hover:border-stone-400'
                                        }`}
                                    style={{ backgroundColor: color }}
                                    title={`Color: ${color}`}
                                />
                            ))}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-4 mb-8">
                            <div>
                                <h2 className="text-3xl font-light tracking-tight mb-2">
                                    {selectedProduct.name}
                                </h2>
                                <p className="text-stone-600 font-light">
                                    {selectedProduct.description}
                                </p>
                            </div>
                            <div className="text-2xl font-light">
                                ₹{selectedProduct.price}
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 px-6 font-light tracking-wide transition-all active:scale-95"
                        >
                            ADD TO CART
                        </button>

                        {showNotification && (
                            <div className="mt-4 p-3 bg-stone-100 border border-stone-300 text-sm text-stone-700 font-light animate-fade-in-up">
                                Added to cart ✓
                            </div>
                        )}
                    </div>

                    {/* Product Selection Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {PRODUCTS.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => {
                                    setSelectedProduct(product)
                                    setSelectedColor(product.colors[0])
                                }}
                                className={`p-6 rounded-sm transition-all text-left group ${selectedProduct.id === product.id
                                    ? 'bg-stone-900 text-white'
                                    : 'bg-stone-100 hover:bg-stone-200 text-stone-900'
                                    }`}
                            >
                                <div className="flex gap-2 mb-4">
                                    {product.colors.map((color) => (
                                        <div
                                            key={color}
                                            className="w-5 h-5 rounded-sm border border-stone-300"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                                <h3 className="font-light text-sm tracking-wide mb-2">{product.name}</h3>
                                <p className={`text-sm font-light mb-3 ${selectedProduct.id === product.id
                                    ? 'text-white/70'
                                    : 'text-stone-600'
                                    }`}>
                                    {product.description}
                                </p>
                                <div className="text-lg font-light">₹{product.price}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto text-center space-y-8">
                <h2 className="text-4xl font-light tracking-tight">
                    Discover the Collection
                </h2>
                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-8 py-3 font-light tracking-wide transition-all group"
                >
                    SHOP NOW
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </section>
    )
}