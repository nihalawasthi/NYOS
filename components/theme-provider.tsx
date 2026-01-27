'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import { WishlistProvider } from '@/lib/wishlist-context'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <WishlistProvider>
        {children}
      </WishlistProvider>
    </NextThemesProvider>
  )
}
