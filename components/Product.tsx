'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Heart } from 'lucide-react'
import { getProducts } from '@/lib/api'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import type { Product as ProductType } from '@/lib/api'

export default function ProductSection() {
    const { addItem } = useCart()
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
    const [products, setProducts] = useState<ProductType[]>([])
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null)
    const [selectedColor, setSelectedColor] = useState('')
    const [showNotification, setShowNotification] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true)
            const data = await getProducts()
            if (data.length > 0) {
                setProducts(data)
                setSelectedProduct(data[0])
                setSelectedColor(data[0].colors[0])
            }
            setLoading(false)
        }
        loadProducts()
    }, [])

    const handleAddToCart = () => {
        if (!selectedProduct) return
        
        addItem({
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            color: selectedColor,
            size: 'M',
            quantity: 1,
        })
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 2000)
    }

    if (loading || !selectedProduct) {
        return <section className="py-24 px-6 bg-white border-b border-stone-200 relative z-0 text-center text-stone-500 font-light">Loading...</section>
    }

    return (
        <section className="py-24 px-6 bg-white border-b border-stone-200 relative z-0">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                    {/* Product Image */}
                    <div className="animate-fade-in-up">
                        <div className="bg-stone-100 rounded-sm overflow-hidden h-96 mb-8 flex items-center justify-center">
                            <img
                                src={selectedProduct.image || `/placeholder.svg?height=400&width=400`}
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
                        <button
                            onClick={() => {
                                if (selectedProduct) {
                                    if (isInWishlist(selectedProduct.id)) {
                                        removeFromWishlist(selectedProduct.id)
                                    } else {
                                        addToWishlist(selectedProduct.id)
                                    }
                                }
                            }}
                            className={`w-full py-3 px-6 font-light tracking-wide transition-all border-2 mt-3 ${
                                selectedProduct && isInWishlist(selectedProduct.id)
                                    ? 'border-red-400 bg-red-50 text-red-600 hover:bg-red-100'
                                    : 'border-stone-300 text-stone-600 hover:border-stone-400'
                            }`}
                        >
                            <Heart className="inline mr-2 w-4 h-4" fill={selectedProduct && isInWishlist(selectedProduct.id) ? 'currentColor' : 'none'} />
                            {selectedProduct && isInWishlist(selectedProduct.id) ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
                        </button>

                        {showNotification && (
                            <div className="mt-4 p-3 bg-stone-100 border border-stone-300 text-sm text-stone-700 font-light animate-fade-in-up">
                                Added to cart ✓
                            </div>
                        )}
                    </div>

                    {/* Product Selection Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {products.map((product) => (
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