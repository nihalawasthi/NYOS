'use client'

import { useEffect, useRef } from 'react'
import { useCurtainScroll } from '@/lib/curtainScroll'
import Hero3DViewer from './hero'

export default function CurtainHeroWrapper() {
  const { scrollProgress } = useCurtainScroll()
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate curtain opening percentage (0 to 100)
  const openPercentage = scrollProgress * 100
  const showScrollIndicator = scrollProgress <= 0.01

  return (
    <div ref={containerRef} className="relative w-full h-[300vh]">
      {/* Fixed viewport container; offset for fixed nav height */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">

        {/* Hero Section (Behind everything) */}
        <div className="absolute inset-0 z-0">
          <Hero3DViewer scrollProgress={scrollProgress} />
        </div>

      {/* Scroll Indicator - Animated Mouse Wheel */}
      <style>{`
        @keyframes scrollIndicator {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          80% {
            transform: translate(0, 20px);
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
      <div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 pointer-events-none z-[199999] transition-opacity duration-300"
        style={{ opacity: showScrollIndicator ? 1 : 0 }}
      >
        <div className="relative w-8 h-12 border-2 border-black rounded-full flex justify-center">
          <div
            className="w-1.5 h-1.5 bg-black rounded-full"
            style={{
              marginTop: '4px',
              animation: 'scrollIndicator 2s infinite',
            }}
          />
        </div>
        <p className="text-black text-sm font-light text-center mt-2">Scroll</p>
      </div>
        {/* Left Curtain panel with gradient and texture */}
        <div
          className="absolute top-0 left-0 bottom-0 z-50 transition-transform duration-300 ease-out"
          style={{ width: '50%', transform: `translateX(-${openPercentage}%)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#f4f4f4] via-[#e9e9e9] to-[#dcdcdc]" />
          {/* Texture overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          {/* Blob accents */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#4a4a4a] rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
          {/* <div className="absolute bottom-6 left-1/3 w-48 h-48 bg-[#4a4a4a] rounded-full mix-blend-multiply filter blur-3xl opacity-40" /> */}
          {/* NY Image on Left Curtain */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-1 z-20">
            <div className="flex flex-col text-right items-end overflow-hidden">
              <img src="/ny.png" alt="NY" className="h-[200px] w-auto object-contain" />
              <p
                className="text-2xl md:text-3xl mt-4 font-light text-black">
                Not Your
              </p>
            </div>
          </div>
        </div>

        {/* Right Curtain panel with gradient and texture */}
        <div
          className="absolute top-0 right-0 bottom-0 z-50 transition-transform duration-300 ease-out"
          style={{ width: '50%', transform: `translateX(${openPercentage}%)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-bl from-[#f4f4f4] via-[#e9e9e9] to-[#dcdcdc]" />
          {/* Texture overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          {/* Blob accents */}
          <div className="absolute -bottom-16 -right-10 w-64 h-64 bg-[#4a4a4a] rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
          <div className="absolute top-8 right-1/3 w-48 h-48 bg-[#4a4a4a] rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
          {/* OS Image on Right Curtain */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-1 z-20">
            <div className="flex flex-col text-left items-start">
              <img src="/os.png" alt="OS" className="h-[200px] w-auto object-contain" />
              <p
                className="text-2xl md:text-3xl mt-4 font-light text-black">
                Ordinary Store
              </p>
            </div>
          </div>
        </div>

        {/* Top decorative bar - Above curtains */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-[#000000] z-[70]" />
      </div>
    </div>
  )
}
