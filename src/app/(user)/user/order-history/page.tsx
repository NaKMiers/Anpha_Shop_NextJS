import OrderItem from '@/components/OrderItem'
import React from 'react'
import { BsThreeDots } from 'react-icons/bs'

function OrderHistoryPage() {
  return (
    <div>
      <h1 className='font-semibold text-3xl font-body tracking-wide mb-5'>LỊCH SỬ MUA HÀNG CỦA TÔI</h1>

      {/* Filter */}
      <div className='flex justify-end'>
        <button className='px-3 py-[2px] rounded-md shadow-lg ml-auto group hover:bg-primary common-transition mb-3'>
          <BsThreeDots size={28} className='group-hover:text-white common-transition' />
        </button>
      </div>

      <div className='pt-4' />

      {/* Order items */}
      {Array.from({ length: 5 }).map((_, index) => (
        <OrderItem className={index !== 0 ? 'mt-4' : ''} key={index} />
      ))}
    </div>
  )
}

export default OrderHistoryPage
