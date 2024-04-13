'use client'

import { FullyOrder } from '@/app/api/user/order-history/route'
import CartItem from '@/components/CartItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IAccount } from '@/models/AccountModel'
import { IOrder } from '@/models/OrderModel'
import { getOrderApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { formatTime } from '@/utils/time'
import { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoIosHelpCircle } from 'react-icons/io'

function AdminOrderDetailPage({ params: { code } }: { params: { code: string } }) {
  // hooks
  const dispatch = useAppDispatch()

  // states
  const [order, setOrder] = useState<FullyOrder | null>(null)

  useEffect(() => {
    const getOrder = async () => {
      // start page loading
      dispatch(setPageLoading(true))

      try {
        const { order } = await getOrderApi(code)

        // set order to state
        setOrder(order)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }

    if (code) {
      getOrder()
    }
  }, [code, dispatch])

  return (
    <div className='bg-white px-7 py-21 rounded-medium shadow-medium-light'>
      <h1 className='font-semibold text-3xl font-body tracking-wide mb-5'>
        Order Detail: <span className='text-rose-500 font-sans'>{order?.code}</span>
      </h1>

      <hr className='my-5' />

      {/* Info */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <div className='col-span-1 rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
          <span className='font-semibold'>Date: </span>
          {order && <span className=''>{formatTime(order.createdAt)}</span>}
        </div>
        <div className='col-span-1 rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
          <span className='font-semibold'>Status: </span>
          <span className='font-semibold text-green-500'>{order?.status}</span>
        </div>
        <div className='col-span-1 rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
          <span className='font-semibold'>Email: </span>
          <span className='text-sky-500'>{order?.email}</span>
        </div>
        <div className='col-span-1 rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
          <span className='font-semibold'>Total: </span>
          <span className='text-secondary font-semibold'>{formatPrice(order?.total)}</span>
        </div>
        {order?.voucherApplied && (
          <div className='rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
            <span className='font-semibold'>Voucher: </span>
            <span className='text-slate-400 font-semibold' title={order?.voucherApplied.desc}>
              {order?.voucherApplied.code}
            </span>
          </div>
        )}
        {!!order?.discount && (
          <div className='rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
            <span className='font-semibold'>Giảm giá: </span>
            <span className='text-secondary font-semibold'>{formatPrice(order?.discount)}</span>
          </div>
        )}
      </div>

      <div className='pt-6' />

      {/* Product */}
      <h3 className='text-2xl font-semibold mb-4'>Product{(order?.items.length || 0) > 1 ? 's' : ''}</h3>

      {order?.items.map(item => (
        <div className='pl-5 relative mb-5' key={item.product._id}>
          <div className='absolute top-1/2 -translate-y-1/2 left-0 h-[88%] w-px bg-slate-200' />

          <div className='rounded-medium border border-slate-300 shadow-lg p-21'>
            <CartItem cartItem={item} isCheckout localCartItem isOrderDetailProduct />

            {order.status === 'done' ? (
              item.accounts.map((account: IAccount) => (
                <Fragment key={account._id}>
                  <hr className='mt-5 mb-3' />

                  <div className='border border-slate-300 rounded-xl p-4'>
                    {account.info.split(' ').map((word, index) => (
                      <span
                        key={index}
                        className='cursor-pointer'
                        onClick={() => {
                          navigator.clipboard.writeText(word)
                          toast.success('Copied: ' + word)
                        }}>
                        {word + ' '}
                      </span>
                    ))}
                  </div>
                </Fragment>
              ))
            ) : (
              <p
                className={`mt-3 text-center italic ${
                  order.status === 'pending' ? 'text-yellow-500' : 'text-slate-400'
                } border-t border-slate-200`}>
                {order.status}
              </p>
            )}

            {order.status === 'done' && (
              <p className='flex items-center gap-1 text-slate-500 mt-2'>
                <IoIosHelpCircle size={20} /> Ấn để sao chép từng phần
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminOrderDetailPage
