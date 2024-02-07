'use client'

import { Children, useCallback, useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface SliderProps {
  time?: number
  children: React.ReactNode
  className?: string
  hideControls?: boolean
}

function Slider({ time, hideControls, children, className }: SliderProps) {
  const [slide, setSlide] = useState(1)
  const childrenAmount = Children.count(children)
  console.log(childrenAmount)
  const slideTrackRef = useRef<HTMLDivElement>(null)

  // previous slide
  const handlePrev = useCallback(() => {
    setSlide(prev => (prev - 1 < 1 ? childrenAmount : prev - 1))
  }, [childrenAmount])

  // next slide
  const handleNext = useCallback(() => {
    setSlide(prev => (prev + 1 > childrenAmount ? 1 : prev + 1))
  }, [childrenAmount])

  useEffect(() => {
    if (slideTrackRef.current) {
      slideTrackRef.current.style.marginLeft = `-${(slide - 1) * 100}%`
    }
  }, [slide])

  useEffect(() => {
    if (time) {
      const interval = setInterval(() => {
        handleNext()
      }, time)

      return () => clearInterval(interval)
    }
  }, [time, childrenAmount, handleNext])

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-lg ${className}`}>
      {/* Slide Track */}
      <div className={`flex w-full h-full transition-all duration-500`} ref={slideTrackRef}>
        {Children.toArray(children).map((child, index) => (
          <div key={index} className='h-full w-full shrink-0'>
            {child}
          </div>
        ))}
      </div>

      {/* Next - Previous */}
      {!hideControls && (
        <>
          <button
            className='group absolute flex items-center justify-center hover:bg-slate-400 hover:bg-opacity-50  common-transition h-full w-12 left-0 top-0'
            onClick={handlePrev}>
            <FaChevronLeft size={16} color='#fff' className='group-hover:scale-125 common-transition' />
          </button>
          <button
            className='group absolute flex items-center justify-center hover:bg-slate-400 hover:bg-opacity-50  common-transition h-full w-12 right-0 top-0'
            onClick={handleNext}>
            <FaChevronRight size={16} color='#fff' className='group-hover:scale-125 common-transition' />
          </button>
        </>
      )}

      {/* Indicators */}
      <div className='absolute flex items-center gap-5 left-1/2 -translate-x-1/2 bottom-[8%]'>
        {Array.from({ length: childrenAmount }).map((_, index) => {
          return (
            <button
              key={index}
              className={`w-[14px] h-[14px] rounded-full bg-white hover:bg-opacity-100 common-transition shadow-md ${
                slide === index + 1 ? 'bg-opacity-100' : 'bg-opacity-50'
              }`}
              onClick={() => setSlide(index + 1)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Slider
