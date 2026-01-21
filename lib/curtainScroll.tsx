'use client'

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'

interface CurtainScrollContextType {
  scrollProgress: number // 0 to 1
  isAnimationComplete: boolean
}

const CurtainScrollContext = createContext<CurtainScrollContextType>({
  scrollProgress: 0,
  isAnimationComplete: false,
})

export const useCurtainScroll = () => useContext(CurtainScrollContext)

export function CurtainScrollProvider({ children }: { children: React.ReactNode }) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)
  const animationSectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Find the curtain/hero combined section
    const handleScroll = () => {
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      
      // Animation happens over 3 viewports to sync curtains, tshirt, and page scroll
      const animationHeight = viewportHeight * 3
      
      if (scrollY < animationHeight) {
        const progress = Math.min(scrollY / animationHeight, 1)
        setScrollProgress(progress)
        setIsAnimationComplete(progress >= 1)
      } else {
        setScrollProgress(1)
        setIsAnimationComplete(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <CurtainScrollContext.Provider value={{ scrollProgress, isAnimationComplete }}>
      {children}
    </CurtainScrollContext.Provider>
  )
}
