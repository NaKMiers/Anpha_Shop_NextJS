'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import ProductCard from './ProductCard'

interface GroupProductsProps {}

function GroupProducts({}: GroupProductsProps) {
  const [isExpaned, setIsExpaned] = useState(false)
  const [isMedium, setIsMedium] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
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
    <div className='relative'>
      {/* Ears */}
      <div className='flex justify-between px-6'>
        <div className='flex gap-2 py-2 px-3 items-center bg-white rounded-t-xl border-b-2 opacity-90'>
          <div className='aspect-square items-center w-6 h-6'>
            <Image src='/images/netflix-icon.jpg' width={200} height={200} alt='netflix' />
          </div>
          <span className='font-semibold'>Netflix</span>
        </div>
        <div className='flex gap-2 py-2 px-3 items-center bg-white rounded-t-xl border-b-2 opacity-90'>
          {isMedium ? (
            <button className='text-sky-600' onClick={() => setIsExpaned(prev => !prev)}>
              {isExpaned ? 'Thu lại' : 'Tất cả'}
            </button>
          ) : (
            <Link href='/category/?ctg=netflix' className='underline text-sky-600'>
              Tất cả
            </Link>
          )}
        </div>
      </div>

      {!isExpaned && (
        <>
          <button
            className='flex items-center justify-center absolute -left-21 top-[45%] translate-y-1/2 bg-white bg-opacity-80 w-10 h-11 z-10 rounded-l-small shadow-md common-transition hover:bg-opacity-100 group'
            onClick={handlePrev}>
            <FaChevronLeft size={18} color='#333' className='group-hover:scale-125 common-transition' />
          </button>
          <button
            className='flex items-center justify-center absolute -right-21 top-[45%] translate-y-1/2 bg-white bg-opacity-80 w-10 h-11 z-10 rounded-r-small shadow-md common-transition hover:bg-opacity-100 group'
            onClick={handleNext}>
            <FaChevronRight size={18} color='#333' className='group-hover:scale-125 common-transition' />
          </button>
        </>
      )}

      {/* Slider */}
      <div className='flex flex-wrap px-21/2 bg-white bg-opacity-90 rounded-medium shadow-medium'>
        <div
          className={`flex ${
            isExpaned ? 'flex-wrap gap-y-21' : 'cursor-pointer'
          } w-full py-21 overflow-x-auto ${!isDragging ? 'snap-x' : ''}`}
          ref={slideTrackRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseMove={handleDraging}
          onMouseUp={() => setIsDragging(false)}>
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-21/2 ${
                !isDragging ? 'snap-start' : ''
              }`}>
              <ProductCard />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GroupProducts
