import { useAppDispatch } from '@/libs/hooks'
import { addCartItem } from '@/libs/reducers/cartReducer'
import { IOrder } from '@/models/OrderModel'
import { addToCartApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { formatTime } from '@/utils/time'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import CartItem from './CartItem'
import LoadingButton from './LoadingButton'
import { FullyOrder } from '@/app/api/user/order-history/route'

interface OrderItemProps {
  order: FullyOrder
  className?: string
}

function OrderItem({ order, className = '' }: OrderItemProps) {
  // hooks
  const dispatch = useAppDispatch()
  const router = useRouter()

  // states
  const [isReBuying, setIsReBuying] = useState<boolean>(false)

  // handle re-buying
  const handleReBuying = useCallback(async () => {
    // start loading
    setIsReBuying(true)

    try {
      // send request to add product to cart
      const { cartItems, message, errors } = await addToCartApi(
        order.items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
        }))
      )

      // show toast success
      if (message) {
        toast.success(message)
      }
      if (errors.notEnough) {
        toast.error(errors.notEnough)
      }
      if (errors.notFound) {
        toast.error(errors.notFound)
      }

      // add cart item to state
      dispatch(addCartItem(cartItems))

      // move to cart page
      router.push(`/cart`)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setIsReBuying(false)
    }
  }, [dispatch, order.items, router])

  return (
    <div className={`border rounded-medium px-21 py-4 ${className}`}>
      {/* Head Info */}
      <div className='flex flex-wrap items-center justify-between gap-x-3'>
        <div>
          <span className='font-semibold'>Mã hóa đơn: </span>
          <span className='text-primary font-semibold'>{order.code}</span>
        </div>
        <div>
          <span className='font-semibold'>Ngày đặt hàng: </span>
          <span>{formatTime(order.createdAt)}</span>
        </div>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-x-3'>
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

      {order.voucherApplied && (
        <div className='flex flex-wrap items-center justify-between gap-x-3'>
          <div>
            <span className='font-semibold'>Voucher: </span>
            <span title={order.voucherApplied.desc} className='font-semibold text-slate-400'>
              {order.voucherApplied.code}
            </span>
          </div>
          <div>
            <span className='font-semibold'>Giảm giá: </span>
            <span className='text-secondary'>{formatPrice(order.discount)}</span>
          </div>
        </div>
      )}

      {order.items.map(item => (
        <CartItem cartItem={item} localCartItem isCheckout className='mt-4' key={item.product._id} />
      ))}

      <hr className='mt-8 mb-3' />

      {/* Total */}
      <div className='flex justify-end items-center gap-2 mb-2'>
        <span>Tổng: </span>
        <span className='text-green-500 font-semibold text-2xl'>{formatPrice(order.total)}</span>
      </div>

      {/* Action Buttons */}
      <div className='flex justify-end gap-2'>
        <LoadingButton
          className='px-[14px] py-[6px] rounded-md font-semibold bg-secondary hover:bg-primary text-white hover:text-dark common-transition'
          onClick={handleReBuying}
          text='Mua lại'
          isLoading={isReBuying}
        />
        <Link
          href={`/user/order/${order?.code}`}
          className='px-[14px] py-[6px] rounded-md font-semibold bg-primary hover:bg-secondary hover:text-white common-transition'>
          Chi tiết
        </Link>
      </div>
    </div>
  )
}

export default OrderItem
