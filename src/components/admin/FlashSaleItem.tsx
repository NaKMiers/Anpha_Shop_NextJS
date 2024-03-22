import { FlashSaleWithProducts } from '@/app/(admin)/admin/flash-sale/all/page'
import { formatPrice } from '@/utils/formatNumber'
import { formatTime } from '@/utils/formatTime'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaCheck, FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'

interface FlashSaleItemProps {
  data: FlashSaleWithProducts
  loadingFlashSales: string[]
  className?: string

  selectedFlashSales: string[]
  setSelectedFlashSales: React.Dispatch<React.SetStateAction<string[]>>

  handleDeleteFlashSales: (ids: string[]) => void
}

function FlashSaleItem({
  data,
  loadingFlashSales,
  className,
  // selected
  selectedFlashSales,
  setSelectedFlashSales,
  // functions
  handleDeleteFlashSales,
}: FlashSaleItemProps) {
  return (
    <div
      className={`flex flex-col p-4 rounded-lg shadow-lg cursor-pointer common-transition ${
        selectedFlashSales.includes(data._id) ? 'bg-sky-50 -translate-y-1' : 'bg-white'
      }  ${className}`}
      onClick={() =>
        setSelectedFlashSales(prev =>
          prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
        )
      }>
      <div className='font-semibold' title='netflix'>
        <span title='Value' className='font-semibold text-primary mr-2'>
          {data.type === 'percentage' ? data.value : formatPrice(+data.value)}
        </span>
        <span title='Time Type'>{data.timeType}</span>
      </div>

      <div className='font-semibold' title='netflix'>
        <span className='mr-2' title='Type'>
          {data.type}
        </span>
        {data.timeType === 'loop' && (
          <span className='font-semobold text-secondary' title='duration'>
            {data.duration}
          </span>
        )}
      </div>

      <div>
        <span title='Begin (d/m/y)'>{formatTime(data.begin)}</span>
        {data.timeType === 'once' && data.expire && (
          <span title='Begin (d/m/y)'>
            {' - '} {formatTime(data.expire)}
          </span>
        )}
      </div>

      <p className='font-semibold'>
        <span>Product Quantity:</span> <span className='text-primary'>{data.productQuantity}</span>
      </p>

      <div className='flex flex-wrap rounded-lg gap-2 max-h-24 overflow-y-auto'>
        {[...data.products].map(product => (
          <div
            className='border border-slate-300 bg-white rounded-lg flex items-center p-2 gap-2'
            key={product._id}>
            <Image
              className='aspect-video rounded-md border'
              src={product.images[0]}
              height={45}
              width={45}
              alt='thumbnail'
            />
            <span>{product.title}</span>
          </div>
        ))}
      </div>

      <div className='flex self-end border border-dark text-dark rounded-lg px-3 py-2 gap-4'>
        {/* Edit Button Link */}
        <Link
          href={`/admin/flash-sale/${data._id}/edit`}
          target='_blank'
          className='block group'
          onClick={e => e.stopPropagation()}>
          <MdEdit size={18} className='group-hover:scale-125 common-transition' />
        </Link>

        {/* Delete Button */}
        <button
          className='block group'
          onClick={e => {
            e.stopPropagation()
            handleDeleteFlashSales([data._id])
          }}
          disabled={loadingFlashSales.includes(data._id)}>
          {loadingFlashSales.includes(data._id) ? (
            <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
          ) : (
            <FaTrash size={18} className='group-hover:scale-125 common-transition' />
          )}
        </button>
      </div>
    </div>
  )
}

export default FlashSaleItem
