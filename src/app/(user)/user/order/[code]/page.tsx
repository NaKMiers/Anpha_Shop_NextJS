'use client'

import CartItem from '@/components/CartItem'
import Divider from '@/components/Divider'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IAccount } from '@/models/AccountModel'
import { IOrder } from '@/models/OrderModel'
import { IVoucher } from '@/models/VoucherModel'
import { getOrderApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { formatTime } from '@/utils/time'
import { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoIosHelpCircle } from 'react-icons/io'

function OrderDetailPage({ params: { code } }: { params: { code: string } }) {
  // hooks
  const dispatch = useAppDispatch()

  // states
  const [order, setOrder] = useState<IOrder | null>(null)

  // MARK: Get Data
  // get order
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
    <div className='-m-3'>
      <h1 className='font-semibold text-3xl font-body tracking-wide mb-5'>
        CHI TIẾT ĐƠN HÀNG: <span className='text-secondary font-sans'>{order?.code}</span>
      </h1>

      <Divider size={5} border />

      {/* MARK: Info */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 items-start'>
        <div className='rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
          <span className='font-semibold'>Ngày mua: </span>
          {order && <span className=''>{formatTime(order.createdAt)}</span>}
        </div>
        <div className='rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
          <span className='font-semibold'>Trạng thái: </span>
          <span
            className={`${
              order?.status === 'pending'
                ? 'text-yellow-500'
                : order?.status === 'done'
                ? 'text-green-500'
                : 'text-slate-400'
            }`}>
            {order?.status === 'pending'
              ? 'Đang xử lí'
              : order?.status === 'done'
              ? 'Hoàn tất'
              : 'Đã hủy'}
          </span>
        </div>
        <div className='rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
          <span className='font-semibold'>Email: </span>
          <span className='text-sky-500'>{order?.email}</span>
        </div>
        <div className='rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
          <span className='font-semibold'>Tổng tiền: </span>
          <span className='text-green-500 font-semibold'>{formatPrice(order?.total)}</span>
        </div>
        {order?.voucherApplied && (
          <div className='rounded-xl shadow-lg py-2 px-4 hover:tracking-wide common-transition'>
            <span className='font-semibold'>Voucher: </span>
            <span
              className='text-slate-400 font-semibold'
              title={(order?.voucherApplied as IVoucher).desc}>
              {(order?.voucherApplied as IVoucher).code}
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

      <Divider size={6} />

      {/* MARK: Product */}
      <h3 className='text-2xl font-semibold mb-4'>SẢN PHẨM</h3>

      {order?.items.map(item => (
        <div className='pl-21/2 relative mb-5' key={item.product._id}>
          <div className='absolute top-1/2 -translate-y-1/2 left-0 h-[88%] w-px bg-slate-200' />

          <div className='rounded-medium border border-slate-300 shadow-lg p-21/2'>
            <CartItem cartItem={item} isCheckout localCartItem isOrderDetailProduct />

            {order.status === 'done' ? (
              item.accounts.map((account: IAccount) => (
                <Fragment key={account._id}>
                  <hr className='mt-5 mb-3' />

                  <div className='border border-slate-300 rounded-xl p-4 w-full mt-2 max-h-[200px] text-sm font-body tracking-wide overflow-auto whitespace-pre break-all'>
                    {account.info.split('\n').map((line, index) => (
                      <span key={index} className='block'>
                        {line.split(' ').map((word, index) => (
                          <span
                            key={index}
                            className='inline-block cursor-pointer'
                            onClick={e => {
                              e.stopPropagation()
                              navigator.clipboard.writeText(word)
                              toast.success('Đã sao chép: ' + word)
                            }}>
                            {word}{' '}
                          </span>
                        ))}
                      </span>
                    ))}
                  </div>
                </Fragment>
              ))
            ) : (
              <p
                className={`mt-6 text-center italic ${
                  order.status === 'pending' ? 'text-yellow-500' : 'text-slate-400'
                } border-t border-slate-200 pt-2`}>
                {order.status === 'pending' ? 'Đang xử lí' : 'Đã hủy'}
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

export default OrderDetailPage
