'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import OrderItem from '@/components/admin/OrderItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IOrder } from '@/models/OrderModel'
import { caclIncomeApi, cancelOrdersApi, deletedOrdersApi, getAllOrdersApi } from '@/requests'
import { formatPrice } from '@/utils/formatNumber'
import { handleQuery } from '@/utils/handleQuery'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BiReset } from 'react-icons/bi'
import { FaCalendar, FaFilter, FaSearch, FaSort } from 'react-icons/fa'

function AllOrdersPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [orders, setOrders] = useState<IOrder[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  // loading and confirming
  const [loadingOrders, setLoadingOrders] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 9
  const [minTotal, setMinTotal] = useState<number>(0)
  const [maxTotal, setMaxTotal] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)

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
      userId: '',
      voucherApplied: '',
      status: '',
      paymentMethod: '',
      from: '',
      to: '',
    },
  })

  // get all orders
  useEffect(() => {
    const getAllTags = async () => {
      const query = handleQuery(searchParams)
      console.log(query)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // sent request to server
        const { orders, amount, chops } = await getAllOrdersApi(query) // cache: no-store

        // update orders from state
        setOrders(orders)
        setAmount(amount)
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
    getAllTags()
  }, [dispatch, searchParams])

  // cancel orders
  const handleCancelOrders = useCallback(async (ids: string[]) => {
    try {
      // senred request to server
      const { canceledOrders, message } = await cancelOrdersApi(ids)

      // update orders from state
      setOrders(prev =>
        prev.map(order =>
          canceledOrders.map((order: IOrder) => order._id).includes(order._id)
            ? { ...order, status: 'cancel' }
            : order
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // delete orders
  const handleDeleteOrders = useCallback(async (ids: string[]) => {
    setLoadingOrders(ids)

    try {
      // senred request to server
      const { deletedOrders, message } = await deletedOrdersApi(ids)

      // remove deleted tags from state
      setOrders(prev =>
        prev.filter(order => !deletedOrders.map((order: IOrder) => order._id).includes(order._id))
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingOrders([])
      setSelectedOrders([])
    }
  }, [])

  // calculate income
  const handleCalcIncome = useCallback(async (timeType: 'day' | 'month' | 'year') => {
    try {
      const { income } = await caclIncomeApi(new Date(), timeType)

      toast.success(`Income: ${formatPrice(income)}`)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    async data => {
      console.log(data)
      const { from, to, ...rest } = data

      const fromTo = (from || '') + '|' + (to || '')
      console.log(fromTo)

      if (fromTo !== '|') {
        rest['from-to'] = fromTo
      }

      // handle query
      const query = handleQuery({
        ...searchParams,
        ...rest,
        total: total === maxTotal ? [] : [total.toString()],
      })

      console.log(query)

      router.push(pathname + query)
    },
    [router, pathname, searchParams, total, maxTotal]
  )

  // handle reset filter
  const handleResetFilter = useCallback(() => {
    reset()
    router.push(pathname)
  }, [reset, router, pathname])

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A (Select All)
      if (e.altKey && e.key === 'a') {
        e.preventDefault()
        setSelectedOrders(prev => (prev.length === orders.length ? [] : orders.map(order => order._id)))
      }

      // Alt + Delete (Delete)
      if (e.altKey && e.key === 'Delete') {
        e.preventDefault()
        setIsOpenConfirmModal(true)
      }

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
  }, [handleFilter, handleResetFilter, handleSubmit, orders])

  return (
    <div className='w-full'>
      {/* Top & Pagination */}
      <AdminHeader title='All Orders' />
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      {/* Filter */}
      <div className='mt-8 bg-white self-end w-full rounded-medium shadow-md text-dark overflow-auto transition-all duration-300 no-scrollbar p-21 max-w-ful'>
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

          {/* Total */}
          <div className='flex flex-col col-span-12 md:col-span-6'>
            <label htmlFor='total'>
              <span className='font-bold'>Total: </span>
              <span>{formatPrice(total || maxTotal)}</span> - <span>{formatPrice(maxTotal)}</span>
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
          <div className='flex justify-end items-center flex-wrap gap-3 col-span-12 md:col-span-8'>
            {/* Sort */}
            <Input
              id='sort'
              label='Sort'
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

            {/* User ID */}
            <Input
              id='userId'
              label='User ID'
              disabled={false}
              register={register}
              errors={errors}
              icon={FaSort}
              type='select'
              options={[
                {
                  value: '',
                  label: 'All',
                  selected: true,
                },
                {
                  value: 'true',
                  label: 'Yes',
                },
                {
                  value: 'false',
                  label: 'No',
                },
              ]}
            />

            {/* Voucher Applied */}
            <Input
              id='voucherApplied'
              label='Voucher'
              disabled={false}
              register={register}
              errors={errors}
              icon={FaSort}
              type='select'
              options={[
                {
                  value: '',
                  label: 'All',
                  selected: true,
                },
                {
                  value: 'true',
                  label: 'On',
                },
                {
                  value: 'false',
                  label: 'Off',
                },
              ]}
            />

            {/* Status */}
            <Input
              id='status'
              label='Status'
              disabled={false}
              register={register}
              errors={errors}
              icon={FaSort}
              type='select'
              options={[
                {
                  value: '',
                  label: 'All',
                  selected: true,
                },
                {
                  value: 'done',
                  label: 'Done',
                },
                {
                  value: 'pending',
                  label: 'Pending',
                },
                {
                  value: 'cancel',
                  label: 'Cancel',
                },
              ]}
            />
          </div>

          {/* Filter Buttons */}
          <div className='flex justify-end items-center gap-2 col-span-12 md:col-span-4'>
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

          {/* Action Buttons */}
          <div className='flex justify-end items-center gap-2 col-span-12'>
            {/* Select All Button */}
            <button
              className='border border-sky-400 text-sky-400 rounded-lg px-3 py-2 hover:bg-sky-400 hover:text-white common-transition'
              onClick={() =>
                setSelectedOrders(selectedOrders.length > 0 ? [] : orders.map(order => order._id))
              }>
              {selectedOrders.length > 0 ? 'Unselect All' : 'Select All'}
            </button>

            {/* Cancel Many Button */}
            {!!selectedOrders.length &&
              selectedOrders.every(
                id => orders.find(order => order._id === id)?.status === 'pending'
              ) && (
                <button
                  className='border border-slate-300 rounded-lg px-3 py-2 hover:bg-slate-300 hover:text-white common-transition'
                  onClick={() => handleCancelOrders(selectedOrders)}>
                  Cancel
                </button>
              )}

            {/* Delete Many Button */}
            {!!selectedOrders.length && (
              <button
                className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-white common-transition'
                onClick={() => setIsOpenConfirmModal(true)}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      <div className='pt-9' />

      {/* Income */}
      <div className='flex items-center justify-center gap-4 text-white'>
        <div className='flex items-center gap-2'>
          <span className='font-semibold'>From: </span>
          <input
            type='date'
            className='bg-white rounded-lg px-3 h-[40px] text-dark outline-none font-semibold cursor-pointer'
            value={new Date().toISOString().split('T')[0]}
            onChange={() => {}}
          />
        </div>
        <button
          className='rounded-lg font-semibold px-3 py-2 bg-secondary hover:bg-primary hover:text-dark common-transition'
          onClick={() => handleCalcIncome('day')}>
          Day Income
        </button>
        <button
          className='rounded-lg font-semibold px-3 py-2 bg-secondary hover:bg-primary hover:text-dark common-transition'
          onClick={() => handleCalcIncome('month')}>
          Month Income
        </button>
        <button
          className='rounded-lg font-semibold px-3 py-2 bg-secondary hover:bg-primary hover:text-dark common-transition'
          onClick={() => handleCalcIncome('year')}>
          Year Income
        </button>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Delete Orders'
        content='Are you sure that you want to delete these orders?'
        onAccept={() => handleDeleteOrders(selectedOrders)}
        isLoading={loadingOrders.length > 0}
      />

      {/* Amount */}
      <div className='p-3 text-sm text-right text-white font-semibold'>
        {itemPerPage * +(searchParams?.page || 1) > amount
          ? amount
          : itemPerPage * +(searchParams?.page || 1)}
        /{amount} order{amount > 1 ? 's' : ''}
      </div>

      {/* MAIN LIST */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-21 lg:grid-cols-3 items-start'>
        {orders.map(order => (
          <OrderItem
            data={order}
            loadingOrders={loadingOrders}
            setOrders={setOrders}
            selectedOrders={selectedOrders}
            setSelectedOrders={setSelectedOrders}
            handleCancelOrders={handleCancelOrders}
            handleDeleteOrders={handleDeleteOrders}
            key={order._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllOrdersPage
