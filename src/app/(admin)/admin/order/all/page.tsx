'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import OrderItem from '@/components/admin/OrderItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IOrder } from '@/models/OrderModel'
import { cancelOrdersApi, deletedOrdersApi, getAllOrdersApi } from '@/requests'
import { formatPrice } from '@/utils/formatNumber'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCalendar, FaFilter, FaSearch } from 'react-icons/fa'

function AllOrdersPage() {
  // store
  const dispatch = useAppDispatch()

  // states
  const [orders, setOrders] = useState<IOrder[]>([])
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [loadingOrders, setLoadingOrders] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // Form
  const {
    register,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      orderCode: '',
    },
  })

  // get all orders
  useEffect(() => {
    const getAllTags = async () => {
      dispatch(setPageLoading(true))

      try {
        // sent request to server
        const { orders } = await getAllOrdersApi() // cache: no-store

        // update orders from state
        setOrders(orders)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        dispatch(setPageLoading(false))
      }
    }
    getAllTags()
  }, [dispatch])

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

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + A
      if (event.ctrlKey && event.key === 'a') {
        event.preventDefault() // Prevent the default action
        setSelectedOrders(prev => (prev.length === orders.length ? [] : orders.map(order => order._id)))
      }

      // Delete
      if (event.key === 'Delete') {
        event.preventDefault() // Prevent the default aconti
        handleDeleteOrders(selectedOrders)
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [orders, selectedOrders, handleDeleteOrders])

  return (
    <div className='w-full'>
      <AdminHeader title='All Orders' />

      <Pagination />

      <div className='pt-8' />

      {/* Select Filter */}
      <div className='bg-white self-end w-full rounded-medium shadow-md text-dark overflow-auto transition-all duration-300 no-scrollbar p-21 max-w-ful'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-21'>
          <div className='flex flex-col'>
            <Input
              className='max-w-[450px]'
              id='search'
              label='Search'
              disabled={false}
              register={register}
              errors={errors}
              required
              type='text'
              icon={FaSearch}
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
              onChange={() => {}}
            />
          </div>
          <div className='flex gap-2'>
            <Input
              id='from'
              label='From'
              disabled={false}
              register={register}
              errors={errors}
              required
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
              required
              type='date'
              icon={FaCalendar}
              className='w-full'
            />
          </div>
          <div className='flex justify-end items-center flex-wrap gap-3'>Select</div>

          <div className='flex justify-end md:justify-start items-center'>
            {/* Filter Button */}
            <button className='group flex items-center text-nowrap bg-secondary text-[14px] font-semibold p-2 rounded-md cursor-pointer hover:bg-primary text-white hover:text-dark common-transition'>
              Lọc
              <FaFilter size={12} className='ml-1 text-white group-hover:text-dark common-transition' />
            </button>
          </div>

          <div className='flex justify-end items-center col-span-2 gap-2'>
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
        <button className='rounded-lg font-semibold px-3 py-2 bg-secondary hover:bg-primary hover:text-dark common-transition'>
          Day Income
        </button>
        <button className='rounded-lg font-semibold px-3 py-2 bg-secondary hover:bg-primary hover:text-dark common-transition'>
          Month Income
        </button>
        <button className='rounded-lg font-semibold px-3 py-2 bg-secondary hover:bg-primary hover:text-dark common-transition'>
          Year Income
        </button>
      </div>

      <div className='pt-9' />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Delete Orders'
        content='Are you sure that you want to delete these orders?'
        onAccept={() => handleDeleteOrders(selectedOrders)}
        isLoading={loadingOrders.length > 0}
      />

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
