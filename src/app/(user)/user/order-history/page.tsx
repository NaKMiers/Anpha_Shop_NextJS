'use client'

import Input from '@/components/Input'
import OrderItem from '@/components/OrderItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IOrder } from '@/models/OrderModel'
import { getOrderHistoryApi } from '@/requests'
import { formatPrice } from '@/utils/formatNumber'
import { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BsThreeDots } from 'react-icons/bs'
import { FaCaretDown, FaFilter } from 'react-icons/fa'
import { IoMdCode } from 'react-icons/io'

function OrderHistoryPage() {
  // hook
  const dispatch = useAppDispatch()

  // states
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [orders, setOrders] = useState<IOrder[]>([])

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      orderCode: '',
    },
  })

  // get user's order
  useEffect(() => {
    const getOrderHistory = async () => {
      // start page loading
      dispatch(setPageLoading(true))

      try {
        // send request to server to get current user's orders
        const { orders } = await getOrderHistoryApi()

        console.log(orders)

        // set orders to state
        setOrders(orders)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getOrderHistory()
  }, [dispatch])

  return (
    <div className='flex flex-col'>
      <h1 className='font-semibold text-3xl font-body tracking-wide mb-5'>LỊCH SỬ MUA HÀNG CỦA TÔI</h1>

      {/* Filter */}
      <div className='flex justify-end'>
        <button
          onClick={() => setIsShowFilter(!isShowFilter)}
          className='px-3 py-[2px] rounded-md shadow-lg ml-auto group hover:bg-primary common-transition mb-3'>
          <BsThreeDots size={28} className='group-hover:text-white common-transition' />
        </button>
      </div>
      <div
        className={`bg-white self-end w-full rounded-medium shadow-md text-dark overflow-auto transition-all duration-300 no-scrollbar ${
          isShowFilter ? 'p-21 max-w-full max-h-[300px]' : 'max-w-0 max-h-0 p-0'
        }`}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-21'>
          <div className='flex flex-col'>
            <Input
              id='orderCode'
              label='Mã hóa đơn'
              disabled={false}
              register={register}
              errors={errors}
              required
              type='text'
              icon={IoMdCode}
            />
          </div>
          <div className='flex flex-col'>
            <label>
              <span className='font-bold'>Giá: </span>
              <span>{formatPrice(9000)}</span>
              {' - '}
              <span>{formatPrice(2000000)}</span>
            </label>
            <input
              className='input-range h-2 bg-slate-200 rounded-lg my-2'
              type='range'
              min='9000'
              max='2000000'
              value={9000}
              onChange={e => () => {}}
            />
          </div>
          <div className='flex justify-end items-center flex-wrap gap-3'>
            <button
              className='group flex items-center text-nowrap bg-primary text-[14px] font-semibold p-2 rounded-md cursor-pointer hover:bg-secondary hover:text-light common-transition'
              onClick={() => {}}>
              Danh mục
              <FaCaretDown
                size={16}
                className='ml-1 text-dark group-hover:text-light common-transition'
              />
            </button>
          </div>
          <div className='flex justify-end md:justify-start items-center'>
            <button
              className='group flex items-center text-nowrap bg-secondary text-[14px] font-semibold p-2 rounded-md cursor-pointer hover:bg-primary text-light hover:text-dark common-transition'
              onClick={() => {}}>
              Lọc
              <FaFilter size={12} className='ml-1 text-light group-hover:text-dark common-transition' />
            </button>
          </div>
        </div>
      </div>

      <div className='pt-5' />

      {/* Order items */}
      {orders.map((order, index) => (
        <OrderItem order={order} className={index !== 0 ? 'mt-4' : ''} key={order._id} />
      ))}
    </div>
  )
}

export default OrderHistoryPage
