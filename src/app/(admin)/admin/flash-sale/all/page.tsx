'use client'

import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import FlashSaleItem from '@/components/admin/FlashSaleItem'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IFlashsale } from '@/models/FlashsaleModel'
import { IProduct } from '@/models/ProductModel'
import { formatPrice } from '@/utils/formatNumber'
import { formatTime } from '@/utils/formatTime'
import { Menu, MenuItem } from '@mui/material'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaCalendar, FaCaretDown, FaCheck, FaFilter, FaPlus, FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'

export type FlashSaleWithProducts = IFlashsale & { products: IProduct[] }

function AllFlashSalesPage() {
  // hook
  const dispatch = useAppDispatch()
  const isPageLoading = useAppSelector(state => state.modal.isPageLoading)

  // states
  const [flashSales, setFlashSales] = useState<FlashSaleWithProducts[]>([])
  const [selectedFlashSales, setSelectedFlashSales] = useState<string[]>([])
  const [loadingFlashSales, setLoadingFlashSales] = useState<string[]>([])

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      orderCode: '',
    },
  })

  // get all flashsales
  useEffect(() => {
    const getAllFlashSales = async () => {
      // set page loading
      dispatch(setPageLoading(true))

      try {
        // send request to server to get all flash sales
        const res = await axios.get('/api/admin/flash-sale/all')
        console.log('res-flash-sales:', res.data)

        // set flash sales to state
        setFlashSales(res.data.flashSales)
      } catch (err: any) {
        console.log(err)
        toast.error(err.response.data.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }

    getAllFlashSales()
  }, [dispatch])

  // delete voucher
  const handleDeleteFlashSales = useCallback(
    async (ids: string[]) => {
      setLoadingFlashSales(ids)

      try {
        console.log(ids)
        // from selected flash sales, get product ids
        const productIds = flashSales
          .filter(flashSale => ids.includes(flashSale._id))
          .reduce(
            (acc, flashSale) => [...acc, ...flashSale.products.map(product => product._id)],
            [] as string[]
          )

        // send request to server
        const res = await axios.delete(`/api/admin/flash-sale/delete`, { data: { ids, productIds } })
        const { deletedFlashSales, message } = res.data

        // remove deleted vouchers from state
        setFlashSales(prev =>
          prev.filter(
            flashSale =>
              !deletedFlashSales.map((flashSale: IFlashsale) => flashSale._id).includes(flashSale._id)
          )
        )

        // show success message
        toast.success(message)
      } catch (err: any) {
        console.log(err)
        toast.error(err.response.data.message)
      } finally {
        setLoadingFlashSales([])
      }
    },
    [flashSales]
  )

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + A
      if (event.ctrlKey && event.key === 'a') {
        event.preventDefault() // Prevent the default action
        setSelectedFlashSales(prev =>
          prev.length === flashSales.length ? [] : flashSales.map(voucher => voucher._id)
        )
      }

      // Delete
      if (event.key === 'Delete') {
        event.preventDefault() // Prevent the default aconti
        handleDeleteFlashSales(selectedFlashSales)
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [flashSales, selectedFlashSales, handleDeleteFlashSales])

  return (
    <div className='w-full'>
      <div className='flex items-end mb-3 gap-3'>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-white hover:text-primary'
          href='/admin'>
          <FaArrowLeft />
          Admin
        </Link>
        <div className='py-2 px-3 text-light border border-slate-300 rounded-lg text-2xl text-center'>
          All Flash Sales
        </div>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'
          href='/admin/flash-sale/add'>
          <FaPlus />
          Add
        </Link>
      </div>

      <Pagination />

      <div className='pt-8' />

      <div className='bg-white self-end w-full rounded-medium shadow-md text-dark overflow-auto transition-all duration-300 no-scrollbar p-21 max-w-ful'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-21'>
          <div className='flex gap-2'>
            <Input
              id='beginFrom'
              label='Begin From'
              disabled={false}
              register={register}
              errors={errors}
              required
              type='date'
              icon={FaCalendar}
              className='w-full'
            />

            <Input
              id='beginTo'
              label='Begin To'
              disabled={false}
              register={register}
              errors={errors}
              required
              type='date'
              icon={FaCalendar}
              className='w-full'
            />
          </div>
          <div className='flex gap-2'>
            <Input
              id='expireFrom'
              label='Expire From'
              disabled={false}
              register={register}
              errors={errors}
              required
              type='date'
              icon={FaCalendar}
              className='w-full'
            />

            <Input
              id='expireTo'
              label='Expire To'
              disabled={false}
              register={register}
              errors={errors}
              required
              type='date'
              icon={FaCalendar}
              className='w-full'
            />
          </div>

          {/* Select Filter */}
          <div className='flex justify-end items-center flex-wrap gap-3'>Select</div>

          {/* Filter Button */}
          <div className='flex justify-end md:justify-start items-center'>
            <button className='group flex items-center text-nowrap bg-secondary text-[14px] font-semibold p-2 rounded-md cursor-pointer hover:bg-primary text-light hover:text-dark common-transition'>
              Lọc
              <FaFilter size={12} className='ml-1 text-light group-hover:text-dark common-transition' />
            </button>
          </div>

          <div className='flex justify-end items-center col-span-2 gap-2'>
            {/* Select All Button */}
            <button
              className='border border-sky-400 text-sky-400 rounded-lg px-3 py-2 hover:bg-sky-400 hover:text-light common-transition'
              onClick={() =>
                setSelectedFlashSales(
                  selectedFlashSales.length > 0 ? [] : flashSales.map(flashSale => flashSale._id)
                )
              }>
              {selectedFlashSales.length > 0 ? 'Unselect All' : 'Select All'}
            </button>

            {/* Delete Many Button */}
            {!!selectedFlashSales.length && (
              <button
                className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'
                onClick={() => {
                  handleDeleteFlashSales(selectedFlashSales)
                }}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      <div className='pt-9' />

      <div className='grid items-start grid-cols-2 lg:grid-cols-3 gap-21 '>
        {flashSales.map(flashSale => (
          <FlashSaleItem
            data={flashSale}
            loadingFlashSales={loadingFlashSales}
            selectedFlashSales={selectedFlashSales}
            setSelectedFlashSales={setSelectedFlashSales}
            handleDeleteFlashSales={handleDeleteFlashSales}
            key={flashSale._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllFlashSalesPage
