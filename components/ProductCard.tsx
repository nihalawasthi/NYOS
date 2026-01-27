'use client'

import React from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/lib/wishlist-context'
import { useCart } from '@/lib/cart-context'
import type { Product } from '@/lib/api'

interface ProductCardProps {
    product: Product
    onAddToCart?: () => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist()
    const { addItem: addToCart } = useCart()
    const inWishlist = isInWishlist(product.id)

    const toggleWishlist = () => {
        if (inWishlist) {
            removeFromWishlist(product.id)
        } else {
            addToWishlist(product.id)
        }
    }

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            color: product.colors[0] || '',
            size: product.sizes[0] || 'M',
            quantity: 1,
        })
        onAddToCart?.()
    }

    const [imageSrc, setImageSrc] = React.useState(product.image || '/placeholder.svg')

    const handleImageError = () => {
        setImageSrc('/placeholder.svg')
    }

    return (
        <div className="card">
            <div className="top-section">
                {/* Product Image Background */}
                <Link href={`/products/${product.id}`}>
                    <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                    />
                </Link>

                <div className="border-b"></div>
                <div className="icons">
                    <div className="logo ml-2">
                        {product.colors.map((color) => (
                            <div
                                key={color}
                                className="w-5 h-5 rounded-sm border border-white"
                                style={{ backgroundColor: color }}
                                title={`Color: ${color}`}
                            />
                        ))}
                    </div>

                    <div className="ratings">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="svg">
                            <path d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68a1,1,0,0,0,.4,1,1,1,0,0,0,1.05.07L12,18.76l5.1,2.68a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.89l.72,4.19-3.76-2a1,1,0,0,0-.94,0l-3.76,2,.72-4.19a1,1,0,0,0-.29-.89l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z" />
                        </svg>
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="svg">
                            <path d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68a1,1,0,0,0,.4,1,1,1,0,0,0,1.05.07L12,18.76l5.1,2.68a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.89l.72,4.19-3.76-2a1,1,0,0,0-.94,0l-3.76,2,.72-4.19a1,1,0,0,0-.29-.89l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z" />
                        </svg>
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="svg">
                            <path d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68a1,1,0,0,0,.4,1,1,1,0,0,0,1.05.07L12,18.76l5.1,2.68a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.89l.72,4.19-3.76-2a1,1,0,0,0-.94,0l-3.76,2,.72-4.19a1,1,0,0,0-.29-.89l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z" />
                        </svg>
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="svg">
                            <path d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68a1,1,0,0,0,.4,1,1,1,0,0,0,1.05.07L12,18.76l5.1,2.68a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.89l.72,4.19-3.76-2a1,1,0,0,0-.94,0l-3.76,2,.72-4.19a1,1,0,0,0-.29-.89l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z" />
                        </svg>
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="svg">
                            <path d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68a1,1,0,0,0,.4,1,1,1,0,0,0,1.05.07L12,18.76l5.1,2.68a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.89l.72,4.19-3.76-2a1,1,0,0,0-.94,0l-3.76,2,.72-4.19a1,1,0,0,0-.29-.89l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z" />
                        </svg>
                        <span className=''> {Math.round(product.rating * 20)}% </span>
                    </div>
                </div>
            </div>
            <div className="bottom-section">
                <span className="title">{product.name}</span>
                <div className="row row1">
                    <div className="item">
                        <span className="big-text">₹{product.price}</span>
                        <span className="regular-text">Price</span>
                    </div>
                    <div className="item">
                        <button onClick={handleAddToCart} className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                            <span className="big-text">
                                <i className="fa-solid fa-cart-plus"></i>
                            </span>
                            <span className="regular-text">Add to Cart</span>
                        </button>
                    </div>
                    <div className="item">
                        <div className="heart-container" title="Like">
                            <input type="checkbox" className="checkbox" id={`heart-${product.id}`} checked={inWishlist} onChange={toggleWishlist} />
                            <div className="svg-container">
                                <svg viewBox="0 0 24 24" className="svg-outline" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                                </svg>
                                <svg viewBox="0 0 24 24" className="svg-filled" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                                </svg>
                                <svg className="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                                    <polygon points="10,10 20,20"></polygon>
                                    <polygon points="10,50 20,50"></polygon>
                                    <polygon points="20,80 30,70"></polygon>
                                    <polygon points="90,10 80,20"></polygon>
                                    <polygon points="90,50 80,50"></polygon>
                                    <polygon points="80,80 70,70"></polygon>
                                </svg>
                            </div>
                        </div>
                        <span className="regular-text">Wishlist</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
