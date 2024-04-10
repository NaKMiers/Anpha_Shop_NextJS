import { IOrder } from '@/models/OrderModel'
import { formatPrice } from '@/utils/number'
import { formatTime } from '@/utils/time'
import Link from 'next/link'
import CartItem from './CartItem'

interface OrderItemProps {
  order: IOrder
  className?: string
}

function OrderItem({ order, className = '' }: OrderItemProps) {
  return (
    <div className={`border rounded-medium px-21 py-4 ${className}`}>
      <div className='flex flex-wrap items-center justify-between'>
        <div>
          <span className='font-semibold'>Mã hó đơn: </span>
          <span className='text-primary font-semibold'>{order.code}</span>
        </div>
        <div>
          <span className='font-semibold'>Ngày đặt hàng: </span>
          <span>{formatTime(order.createdAt)}</span>
        </div>
      </div>

      <div className='flex flex-wrap items-center justify-between'>
        <div>
          <span className='font-semibold'>Trạng thái: </span>
          <span
            className={
              order.status === 'pending'
                ? 'text-yellow-500'
                : order.status === 'cancel'
                ? 'text-slate-400'
                : order.status === 'done'
                ? 'text-green-500'
                : ''
            }>
            {order.status === 'pending'
              ? 'Đang xử lí'
              : order.status === 'cancel'
              ? 'Đã hủy'
              : order.status === 'done'
              ? 'Hoàn tất'
              : ''}
          </span>
        </div>
        <div>
          <span className='font-semibold'>Phương thức thanh toán: </span>
          <span
            className={`font-semibold ${
              order.paymentMethod === 'momo' ? 'text-[#a1396c]' : 'text-green-600'
            }`}>
            {order.paymentMethod.toUpperCase()}
          </span>
        </div>
      </div>

      {order.items.map(item => (
        <CartItem cartItem={item} localCartItem isCheckout className='mt-4' key={item.product._id} />
      ))}

      <hr className='mt-8 mb-3' />

      <div className='flex justify-end items-center gap-2 mb-2'>
        <span>Tổng: </span>
        <span className='text-green-500 font-semibold text-2xl'>{formatPrice(order.total)}</span>
      </div>

      <div className='flex justify-end gap-2'>
        <button className='px-[14px] py-[6px] rounded-md font-semibold bg-secondary hover:bg-primary text-white hover:text-dark common-transition'>
          Mua lại
        </button>
        <Link
          href={`/user/order/${order.code}`}
          className='px-[14px] py-[6px] rounded-md font-semibold bg-primary hover:bg-secondary hover:text-white common-transition'>
          Chi tiết
        </Link>
      </div>
    </div>
  )
}

export default OrderItem
