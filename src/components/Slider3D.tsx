'use client'

import { carouselProductSamples } from '@/constansts/dataSamples'
import { useEffect, useRef, useState } from 'react'
import CarouselProduct from './item/CarouselItem'

interface Slide3DProps {
  products?: any[]
  className?: string
}

function Slide3D({ products = carouselProductSamples, className = '' }: Slide3DProps) {
  // states

  // refs
  const containerRef = useRef<HTMLDivElement>(null)

  // reset scroll position when reach the end
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
        container.scrollTo({ left: 0, behavior: 'instant' })
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [products.length])

  return (
    <div
      className={`flex items-center h-full py-21 overflow-x-scroll no-scrollbar ${className}`}
      ref={containerRef}>
      {[...products, ...products].map((product, index) => {
        return <CarouselProduct product={product} key={index} />
      })}
    </div>
  )
}

export default Slide3D
