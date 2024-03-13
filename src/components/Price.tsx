import { formatPrice } from '@/utils/formatNumber'
import React from 'react'

interface PriceProps {
  className?: string
}

function Price({ className }: PriceProps) {
  return (
    <div
      className={`flex items-center rounded-md flex-wrap justify-evenly px-[6px] py-[5px] bg-slate-100 font-body gap-2 ${className}`}>
      <div className='text-secondary text-[22px] tracking-wide leading-7'>{formatPrice(45000)}</div>
      <div className='text-gray-400 text-[14px] line-through'>{formatPrice(260000)}</div>
      <div className='bg-yellow-400 text-[13px] font-semibold rounded-md px-1 py-[2px] text-light font-sans'>
        -83%
      </div>
    </div>
  )
}

export default Price
