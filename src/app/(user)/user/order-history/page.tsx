'use client'

import Input from '@/components/Input'
import Meta from '@/components/Meta'
import OrderItem from '@/components/OrderItem'
import Pagination from '@/components/Pagination'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IOrder } from '@/models/OrderModel'
import { getOrderHistoryApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { formatPrice } from '@/utils/number'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BiReset } from 'react-icons/bi'
import { BsThreeDots } from 'react-icons/bs'
import { FaCalendar, FaCaretDown, FaFilter, FaSearch, FaSort } from 'react-icons/fa'
import { IoMdCode } from 'react-icons/io'

function OrderHistoryPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // hook
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [orders, setOrders] = useState<IOrder[]>([])
  const [amount, setAmount] = useState<number>(0)

  // values
  const itemPerPage = 6
  const [minTotal, setMinTotal] = useState<number>(0)
  const [maxTotal, setMaxTotal] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)

  // filter
  const [isShowFilter, setIsShowFilter] = useState(false)

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      search: '',
      sort: 'updatedAt|-1',
      from: '',
      to: '',
    },
  })

  // get user's order
  useEffect(() => {
    const getOrderHistory = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // send request to server to get current user's orders
        const { orders, amount, chops } = await getOrderHistoryApi(query)

        // set to states
        setOrders(orders)
        setAmount(amount)

        // get min - max
        setMinTotal(chops.minTotal)
        setMaxTotal(chops.maxTotal)
        setTotal(searchParams?.total ? +searchParams.total : chops.maxTotal)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getOrderHistory()
  }, [dispatch, searchParams])

  // handle opimize filter
  const handleOptimizeFilter: SubmitHandler<FieldValues> = useCallback(
    data => {
      // prevent sort default
      if (data.sort === 'updatedAt|-1') {
        if (Object.keys(searchParams || {}).length) {
          data.sort = ''
        } else {
          delete data.sort
        }
      }

      // from | to
      const { from, to, ...rest } = data
      const fromTo = (from || '') + '|' + (to || '')
      if (fromTo !== '|') {
        rest['from-to'] = fromTo
      }

      return { ...rest, total: total === maxTotal ? [] : [total.toString()] }
    },
    [searchParams, total, maxTotal]
  )

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    async data => {
      const params: any = handleOptimizeFilter(data)

      // handle query
      const query = handleQuery({ ...searchParams, ...params })

      // push to new url
      console.log(query)
      router.push(pathname + query)
    },
    [handleOptimizeFilter, router, searchParams, pathname]
  )

  // handle reset filter
  const handleResetFilter = useCallback(() => {
    reset()
    router.push(pathname)
  }, [reset, router, pathname])

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + F (Filter)
      if (e.altKey && e.key === 'f') {
        e.preventDefault()
        handleSubmit(handleFilter)()
      }

      // Alt + R (Reset)
      if (e.altKey && e.key === 'r') {
        e.preventDefault()
        handleResetFilter()
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFilter, handleResetFilter, handleSubmit, reset])

  return (
    <div className='flex flex-col'>
      <h1 className='font-semibold text-3xl font-body tracking-wide mb-5'>LỊCH SỬ MUA HÀNG CỦA TÔI</h1>

      {/* Open Filter */}
      <div className='flex justify-end'>
        <button
          onClick={() => setIsShowFilter(!isShowFilter)}
          className='px-3 py-[2px] bg-dark-100 text-white rounded-md shadow-lg ml-auto group hover:bg-primary common-transition mb-3'>
          <BsThreeDots size={28} className='common-transition' />
        </button>
      </div>

      {/* Filter */}
      <div
        className={`bg-dark-100 self-end w-full rounded-medium shadow-md text-white overflow-auto transition-all duration-300 no-scrollbar ${
          isShowFilter
            ? 'p-21 max-w-full max-h-[500px] md:max-h-[300px] opacity-1'
            : 'max-w-0 max-h-0 p-0 opacity-0'
        }`}>
        <div className='grid grid-cols-12 gap-21'>
          {/* Search */}
          <div className='flex flex-col col-span-12 md:col-span-6'>
            <Input
              className='md:max-w-[450px]'
              id='search'
              label='Search'
              disabled={false}
              register={register}
              errors={errors}
              type='text'
              icon={FaSearch}
            />
          </div>

          {/* Price */}
          <div className='flex flex-col col-span-12 md:col-span-6'>
            <label htmlFor='total'>
              <span className='font-bold'>Tổng tiền: </span>
              <span>{formatPrice(total)}</span> - <span>{formatPrice(maxTotal)}</span>
            </label>
            <input
              id='total'
              className='input-range h-2 bg-slate-200 rounded-lg my-2'
              placeholder=' '
              disabled={false}
              type='range'
              min={minTotal || 0}
              max={maxTotal || 0}
              value={total}
              onChange={e => setTotal(+e.target.value)}
            />
          </div>

          {/* From To */}
          <div className='flex flex-wrap sm:flex-nowrap gap-2 col-span-12 lg:col-span-6'>
            <Input
              id='from'
              label='From'
              disabled={false}
              register={register}
              errors={errors}
              type='date'
              icon={FaCalendar}
              className='w-full'
            />

            <Input
              id='to'
              label='To'
              disabled={false}
              register={register}
              errors={errors}
              type='date'
              icon={FaCalendar}
              className='w-full'
            />
          </div>

          {/* Select Filter */}
          <div className='flex justify-end items-center flex-wrap gap-3 col-span-12 md:col-span-6'>
            {/* Sort */}
            <Input
              id='sort'
              label='Sắp xếp'
              disabled={false}
              register={register}
              errors={errors}
              icon={FaSort}
              type='select'
              options={[
                {
                  value: 'createdAt|-1',
                  label: 'Newest',
                },
                {
                  value: 'createdAt|1',
                  label: 'Oldest',
                },
                {
                  value: 'updatedAt|-1',
                  label: 'Latest',
                  selected: true,
                },
                {
                  value: 'updatedAt|1',
                  label: 'Earliest',
                },
              ]}
            />
          </div>

          <div className='flex justify-end gap-2 items-center col-span-12'>
            {/* Filter Button */}
            <button
              className='group flex items-center text-nowrap bg-primary text-[16px] font-semibold py-2 px-3 rounded-md cursor-pointer hover:bg-secondary text-white common-transition'
              title='Alt + Enter'
              onClick={handleSubmit(handleFilter)}>
              Filter
              <FaFilter size={16} className='ml-1 common-transition' />
            </button>

            {/* Reset Button */}
            <button
              className='group flex items-center text-nowrap bg-slate-600 text-[16px] font-semibold py-2 px-3 rounded-md cursor-pointer hover:bg-slate-800 text-white common-transition'
              title='Alt + R'
              onClick={handleResetFilter}>
              Reset
              <BiReset size={24} className='ml-1 common-transition' />
            </button>
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className='p-3 text-sm text-right text-dark font-semibold'>
        {itemPerPage * +(searchParams?.page || 1) > amount
          ? amount
          : itemPerPage * +(searchParams?.page || 1)}
        /{amount} đơn hàng
      </div>

      {/* Order items */}
      {orders.map((order, index) => (
        <OrderItem order={order} className={index !== 0 ? 'mt-4' : ''} key={order._id} />
      ))}

      <Pagination
        searchParams={searchParams}
        amount={amount}
        itemsPerPage={itemPerPage}
        className='mt-11 bg-dark-100 p-[6px] rounded-lg'
      />
    </div>
  )
}

export default OrderHistoryPage
