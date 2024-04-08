'use client'

import { FullyCartItem } from '@/app/api/cart/route'
import CartItem from '@/components/CartItem'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setCartItems, setLocalCartItems } from '@/libs/reducers/cartReducer'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { createOrderApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { getSession, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function CheckoutPage({ params }: { params: { type: string } }) {
  const type: string = params.type

  // hook
  const dispatch = useAppDispatch()
  const router = useRouter()
  const cartItems = useAppSelector(state => state.cart.items)
  const localCartItems = useAppSelector(state => state.cart.localItems)
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [confirmed, setConfirmed] = useState(false)
  const [checkout, setCheckout] = useState<any | null>(null)

  useEffect(() => {
    const checkout = JSON.parse(localStorage.getItem('checkout') ?? 'null')

    if (!checkout && !confirmed) {
      toast.error('Đang quay lại giỏ hàng...')

      router.push('/cart')
    } else {
      setCheckout(checkout)
    }
  }, [confirmed, router, dispatch])

  // handle confirm payment
  const handleConfirmPayment = useCallback(async () => {
    // check if checkout exists
    if (checkout) {
      setConfirmed(true)

      const { selectedCartItems, total, voucher, discount, code, email } = checkout

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // handle confirm payment
        const items = selectedCartItems.map((cartItem: FullyCartItem) => ({
          _id: cartItem._id,
          product: cartItem.product,
          quantity: cartItem.quantity,
        }))

        // send request to server to create order
        const { removedCartItems, message } = await createOrderApi(
          code,
          email,
          total,
          voucher?._id,
          discount,
          items,
          type
        )

        if (curUser) {
          // userId exists => cart is DATABASE cart => remove cart items
          dispatch(setCartItems(cartItems.filter(item => !removedCartItems.includes(item._id))))
        } else {
          // userId does not exist => cart is LOCAL cart => remove LOCAL cart items
          dispatch(
            setLocalCartItems(localCartItems.filter(item => !removedCartItems.includes(item._id)))
          )
        }

        // show success message
        toast.success(message)

        // redirect to order history page
        if (curUser) {
          router.push('/user/order-history')
        } else {
          router.push('/cart')
        }

        // clear checkout (local storage)
        localStorage.removeItem('checkout')
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
  }, [checkout, type, dispatch, router, curUser, cartItems, localCartItems])

  return (
    <div className='mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-medium shadow-medium p-8 pb-16 text-dark'>
      {/* Payment info */}
      <div className='col-span-1 lg:col-span-7 order-2 lg:order-first'>
        {type === 'momo' ? (
          <h1 className='text-4xl text-[#a1396c] text-center font-semibold'>Thanh toán Momo</h1>
        ) : (
          <h1 className='text-4xl text-[#62b866] text-center font-semibold'>Thanh toán BANKING</h1>
        )}

        <div className='pt-4' />

        <p className='text-secondary font-semibold mb-2'>
          * Hãy chuyển vào tài khoản bên dưới với nội dung sau:
        </p>
        {type === 'momo' && (
          <a href='https://me.momo.vn/anphashop'>
            Ấn vào link sau để chuyển nhanh:{' '}
            <span className='text-[#a1396c]'>https://me.momo.vn/anphashop</span>
          </a>
        )}

        <div className='border border-slate-400 py-2 px-4 rounded-md mb-2'>
          {type === 'banking' && (
            <p>
              Ngân hàng: <span className='text-[#399162] font-semibold'>Vietcombank</span>
            </p>
          )}
          {type === 'momo' ? (
            <p>
              Số tài khoản Momo: <span className='text-[#a1396c] font-semibold'>0899320427</span>
            </p>
          ) : (
            <p>
              Số tài khoản: <span className='text-secondary font-semibold'>1040587211</span>
            </p>
          )}
          <p>
            Số tiền chuyển: <span className='text-green-500 font-semibold'>{formatPrice(1000)}</span>
          </p>
          <p>
            Nội dung chuyển khoản:{' '}
            <span className='text-rose-500 underline underline-offset-1 font-semibold'>
              {checkout?.code}
            </span>
          </p>
        </div>

        <p className=''>
          Tài khoản sẽ được gửi cho bạn qua email:{' '}
          <span className='text-green-500'>{checkout?.email}</span>
        </p>

        <p className='italic text-sky-500'>
          Lưu ý: nhấn vào nút{' '}
          <span className='text-secondary underline animate-pulse'>xác nhận thanh toán</span> bên dưới
          sau khi đã chuyển khoản để có thể nhận Email.
        </p>

        <Image
          className='mx-auto mt-6 rounded-lg shadow-medium duration-300 transition hover:-translate-y-2'
          src={type === 'momo' ? '/images/momo-qr.jpg' : '/images/banking-qr.jpg'}
          height={700}
          width={350}
          alt='momo-qr'
        />

        <button
          className='mt-12 text-xl font-semibold rounded-lg w-full px-2 py-3 bg-primary hover:bg-secondary hover:text-light common-transition'
          onClick={handleConfirmPayment}>
          <span className=''>Xác nhận thanh toán</span>
        </button>
      </div>

      {/* Cart items */}
      <div className='col-span-1 lg:col-span-5'>
        <h1 className='text-center font-semibold text-3xl'>Sản phẩm</h1>

        <div className='pt-5' />

        <div>
          {checkout?.selectedCartItems.map((cartItem: FullyCartItem, index: number) => (
            <CartItem
              cartItem={cartItem}
              className={index != 0 ? 'mt-4' : ''}
              key={cartItem._id}
              localCartItem
              isCheckout
            />
          ))}

          <hr className='mt-8 mb-6' />

          {!!checkout?.discount && (
            <div className='flex items-center justify-between'>
              <span>Ưu đãi:</span>
              <span className='font-semibold text-yellow-500'>
                {formatPrice(checkout?.discount || 0)}
              </span>
            </div>
          )}

          <div className='flex items-end justify-between mb-4'>
            <span className='font-semibold text-xl'>Thành tiền:</span>
            <span className='font-semibold text-3xl text-green-500'>
              {formatPrice(checkout?.total || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
