import React, { useEffect, useRef, useState } from 'react'
import CarouselProduct from './CarouselProduct'
import { FullyProduct } from '@/app/api/product/[slug]/route'

interface CarouselProps {
  products: FullyProduct[]
  className?: string
}

function Carousel({ products, className = '' }: CarouselProps) {
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationId: number
    let lastTimestamp: number = 0
    const itemWidth = container.scrollWidth / products.length

    const scroll = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp
      const deltaTime = timestamp - lastTimestamp
      lastTimestamp = timestamp

      const deltaScroll = (deltaTime / 1000) * itemWidth * 0.3

      const newPosition = container.scrollLeft + deltaScroll

      if (newPosition >= container.scrollWidth - container.clientWidth) {
        container.scrollTo({ left: 0, behavior: 'instant' })
      } else {
        container.scrollTo({ left: newPosition, behavior: 'instant' })
      }

      if (!isHovered) {
        animationId = requestAnimationFrame(scroll)
      }
    }

    // start scroll
    if (!isHovered) {
      animationId = requestAnimationFrame(scroll)
    }

    return () => cancelAnimationFrame(animationId)
  }, [products, isHovered])

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
  }, [])

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <div
      className={`flex items-center h-full overflow-x-scroll ${className}`}
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {[...products, ...products].map((product, index) => (
        <CarouselProduct product={product} key={index} />
      ))}
    </div>
  )
}

export default Carousel
