import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
import { WishlistProvider } from '@/lib/wishlist-context'
import { CurtainScrollProvider } from '@/lib/curtainScroll'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NYOS - Not Your Ordinary Store | Premium 3D T-Shirts',
  description: 'Experience cutting-edge 3D-designed T-shirts with interactive product showcase',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" />
      </head>
      <body className={`font-sans antialiased`}>
          <CurtainScrollProvider>
        <CartProvider>
          <WishlistProvider>
            {children}
            <Analytics />
          </WishlistProvider>
        </CartProvider>
        </CurtainScrollProvider>
      </body>
    </html>
  )
}
