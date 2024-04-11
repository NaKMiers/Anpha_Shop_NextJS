'use client'

import React, { useEffect, useRef, useState } from 'react'

interface CounterItem {
  max: number
  value: number
  className?: string
}

function CounterItem({ max, value, className }: CounterItem) {
  const slideTrackRef = useRef<HTMLDivElement>(null)

  // change slide main function
  useEffect(() => {
    if (slideTrackRef.current) {
      let slide = max - value

      if (slide === 0) {
        console.log('max')
        slideTrackRef.current.style.marginTop = `calc(-25px * ${max + 1})`

        setTimeout(() => {
          if (slideTrackRef.current) {
            slideTrackRef.current.style.transition = 'none'
            slideTrackRef.current.style.marginTop = `calc(-25px * ${0})`
          }
        }, 210)

        setTimeout(() => {
          if (slideTrackRef.current) {
            slideTrackRef.current.style.transition = 'all 0.2s linear'
          }
        }, 250)
      } else {
        slideTrackRef.current.style.marginTop = `calc(-25px * ${slide})`
      }
    }
  }, [max, value])

  return (
    <div className={`h-[25px] overflow-y-hidden ${className}`}>
      <div className={`flex flex-col h-full common-transition`} ref={slideTrackRef}>
        {[...Array.from({ length: max + 1 }, (_, i) => max - i), max].map((n, i) => (
          <span className='flex-shrink-0 h-full' key={i}>
            {n}
          </span>
        ))}
      </div>
    </div>
  )
}

export default CounterItem
