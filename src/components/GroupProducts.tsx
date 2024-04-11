'use client'

import { FullyProduct } from '@/app/api/product/[slug]/route'
import { ICategory } from '@/models/CategoryModel'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import ProductCard from './ProductCard'

interface GroupProductsProps {
  category?: ICategory
  products: FullyProduct[]
  hideTop?: boolean
  className?: string
  bestSeller?: boolean
}

function GroupProducts({ category, products, hideTop, bestSeller, className = '' }: GroupProductsProps) {
  // states
  const [isExpaned, setIsExpaned] = useState(false)
  const [isMedium, setIsMedium] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [categoryImage, setCategoryImage] = useState<string>(`/images/${category?.slug}-icon.jpg`)

  // ref
  const slideTrackRef = useRef<HTMLDivElement>(null)

  const handleDraging = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && !isExpaned && slideTrackRef.current) {
        slideTrackRef.current.scrollLeft -= e.movementX
      }
    },
    [isDragging, isExpaned]
  )

  // prev slide
  const handlePrev = useCallback(() => {
    if (slideTrackRef.current) {
      slideTrackRef.current.scrollTo({
        left: slideTrackRef.current.scrollLeft - slideTrackRef.current.children[0].clientWidth,
        behavior: 'smooth',
      })
    }
  }, [])

  // next slide
  const handleNext = useCallback(() => {
    if (slideTrackRef.current) {
      slideTrackRef.current.scrollTo({
        left: slideTrackRef.current.scrollLeft + slideTrackRef.current.children[0].clientWidth,
        behavior: 'smooth',
      })
    }
  }, [])

  // expaned group
  useEffect(() => {
    const handleResize = () => {
      setIsMedium(window.innerWidth >= 768)
    }
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      {/* Top Ears */}
      {!hideTop && (
        <div className={`flex ${!bestSeller ? 'justify-between' : 'justify-end'} px-6`}>
          {!bestSeller && (
            <div className='flex gap-2 py-2 px-3 items-center bg-white rounded-t-xl border-b-2 opacity-90 group'>
              <div className='aspect-square items-center w-6 h-6'>
                <Image
                  className='wiggle'
                  src={categoryImage}
                  onError={() => setCategoryImage('/images/category-icon.jpg')}
                  width={200}
                  height={200}
                  alt={category?.title || 'icon'}
                />
              </div>
              <span className='font-semibold'>{category?.title}</span>
            </div>
          )}
          <div className='flex gap-2 py-2 px-3 items-center bg-white rounded-t-xl border-b-2 opacity-90'>
            {isMedium ? (
              <button className='text-sky-600' onClick={() => setIsExpaned(prev => !prev)}>
                {isExpaned ? 'Thu lại' : 'Tất cả'}
              </button>
            ) : (
              <Link
                href={bestSeller ? '/best-seller' : `/category/?ctg=${category?.slug}`}
                className='underline text-sky-600 hover:text-green-600 common-transition'>
                Tất cả
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Next - Previous Buttons */}
      {!isExpaned && (
        <>
          <button
            className='group flex items-center justify-center absolute -left-21 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 w-10 h-11 z-10 rounded-l-small shadow-md common-transition hover:bg-opacity-100 group'
            onClick={handlePrev}>
            <FaChevronLeft size={18} className='wiggle text-dark' />
          </button>
          <button
            className='group flex items-center justify-center absolute -right-21 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 w-10 h-11 z-10 rounded-r-small shadow-md common-transition hover:bg-opacity-100 group'
            onClick={handleNext}>
            <FaChevronRight size={18} className='wiggle text-dark' />
          </button>
        </>
      )}

      {/* Slider */}
      <div className='flex flex-wrap min-h-[500px] px-21/2 bg-white bg-opacity-90 rounded-medium shadow-medium'>
        <div
          className={`flex ${isExpaned ? 'flex-wrap gap-y-21' : ''} w-full py-21 overflow-x-auto ${
            !isDragging ? 'snap-x snap-mandatory' : ''
          }`}
          ref={slideTrackRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseMove={handleDraging}
          onMouseUp={() => setIsDragging(false)}>
          {products.map((product, index) => {
            const color =
              index <= 2 ? (index <= 1 ? (index <= 0 ? '#f44336' : 'orange') : 'lightgreen') : '#0dcaf0'

            return (
              <div
                key={product._id}
                className={`relative flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-21/2 ${
                  !isDragging ? 'snap-start' : ''
                }`}>
                {bestSeller && (
                  <div
                    className='absolute z-20 right-1 font-[700] rotate-[10deg]'
                    style={{
                      color,
                      fontSize:
                        index <= 2 ? (index <= 1 ? (index <= 0 ? '56px' : '48px') : '40px') : '32px',
                      top:
                        index <= 2 ? (index <= 1 ? (index <= 0 ? '-30px' : '-26px') : '-22px') : '-13px',
                    }}>
                    #{index + 1}
                  </div>
                )}
                <ProductCard product={product} className='' />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default GroupProducts
