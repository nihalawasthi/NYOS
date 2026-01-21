import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
 import { CurtainScrollProvider } from '@/lib/curtain-scroll-context'
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
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body className={`font-sans antialiased`}>
          <CurtainScrollProvider>
        <CartProvider>
          {children}
          <Analytics />
        </CartProvider>
        </CurtainScrollProvider>
      </body>
    </html>
  )
}
