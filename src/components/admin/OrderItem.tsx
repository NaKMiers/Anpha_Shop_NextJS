import { IOrder } from '@/models/OrderModel'
import { formatPrice } from '@/utils/formatNumber'
import { formatTime } from '@/utils/formatTime'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaCheckSquare, FaEye, FaHistory, FaTrash } from 'react-icons/fa'
import { GrDeliver } from 'react-icons/gr'
import { ImCancelCircle } from 'react-icons/im'

interface OrderItemProps {
  order: IOrder
  // loadingOrders: string[]
  // className?: string

  // selectedOrders: string[]
  // setSelectedOrders: React.Dispatch<React.SetStateAction<string[]>>

  // handleActivateOrders: (ids: string[], value: boolean) => void
  // handleDeleteOrders: (ids: string[]) => void
}

function OrderItem({ order }: OrderItemProps) {
  return (
    <div
      className={`relative w-full flex justify items-start gap-2 p-4 rounded-lg shadow-lg cursor-pointer common-transition bg-white`}>
      <div className='w-full'>
        {/* Thumbnails */}
        <div className='w-full h-full flex items-center flex-wrap gap-2 mb-2 max-h-[140px] overflow-y-auto '>
          {[...order.items, ...order.items, ...order.items].map((item: any) => (
            <div className='relative rounded-lg shadow-md overflow-hidden' key={item._id}>
              <Image
                className='aspect-video'
                src={item.product.images[0]}
                height={120}
                width={120}
                alt='thumbnail'
              />
              <span className='py-[2px] px-[3px] rounded-full absolute top-1 right-1 bg-secondary shadow-md text-[8px] font-semibold text-light border-2 border-white'>
                x{item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Information */}
        <div className='flex gap-2 flex-wrap items-center'>
          {/* Status */}
          <p
            className={`inline font-semibold text-${
              order.status === 'done' ? 'green' : order.status === 'pending' ? 'red' : 'slate'
            }-400`}
            title='status'>
            {order.status}
          </p>

          {/* Code */}
          <p className='inline font-semibold text-primary' title='code'>
            {order.code}
          </p>

          {/* Method */}
          <p
            className={`inline font-semibold text-[${
              order.paymentMethod === 'momo' ? '#a1396c' : '#399162'
            }]`}
            title='payment-method'>
            {order.paymentMethod}
          </p>

          {/* UserID */}
          <FaCheckSquare
            title='userId'
            size={18}
            className={`${order.userId ? 'text-green-500' : 'text-slate-300'}`}
          />
        </div>

        {/* Email */}
        <p className='underline' title='email'>
          {order.email}
        </p>

        {/* Total */}
        <p className='mr-2 text-green-600 font-semibold' title='email'>
          {formatPrice(order.total)}{' '}
          <span className='text-orange-700' title='quantity'>
            ({order.items.reduce((quantity, item) => quantity + item.quantity, 0)})
          </span>
        </p>

        {/* Created */}
        <div className='flex flex-wrap gap-x-2'>
          <p className='text-sm' title='Created (d/m/y)'>
            <span className='font-semibold'>Created: </span>
            <span>{formatTime(order.createdAt)}</span>
          </p>

          {/* Updated */}
          <p className='text-sm' title='Updated (d/m/y)'>
            <span className='font-semibold'>Updated: </span>
            <span>{formatTime(order.updatedAt)}</span>
          </p>
        </div>
      </div>

      <div className='flex flex-col flex-shrink-0 border border-dark text-dark rounded-lg px-2 py-3 gap-4'>
        {/* Detail Button */}
        <Link href={`/admin/order/${order._id}`} className='block group' title='Detail'>
          <FaEye size={18} className='text-primary group-hover:scale-125 common-transition' />
        </Link>

        {/* Deliver Button */}
        <button className='block group' title='Deliver'>
          <GrDeliver size={18} className='text-yellow-400 group-hover:scale-125 common-transition' />
        </button>

        {/* Re-Deliver Button */}
        <button className='block group' title='Re-Deliver'>
          <FaHistory size={18} className='text-blue-500 group-hover:scale-125 common-transition' />
        </button>

        {/* Cancel Button */}
        <button className='block group' title='Cancel'>
          <ImCancelCircle size={18} className='text-slate-300 group-hover:scale-125 common-transition' />
        </button>

        {/* Delete Button */}
        <button className='block group' title='Delete'>
          <FaTrash size={18} className='text-rose-500 group-hover:scale-125 common-transition' />
        </button>
      </div>
    </div>
  )
}

export default OrderItem
