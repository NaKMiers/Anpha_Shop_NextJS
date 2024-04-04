'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import FlashSaleItem from '@/components/admin/FlashSaleItem'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IFlashsale } from '@/models/FlashsaleModel'
import { IProduct } from '@/models/ProductModel'
import { deleteFlashSalesApi, getAllFlashSalesApi } from '@/requests'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCalendar, FaFilter } from 'react-icons/fa'

export type FlashSaleWithProducts = IFlashsale & { products: IProduct[] }

function AllFlashSalesPage() {
  // hook
  const dispatch = useAppDispatch()
  const isPageLoading = useAppSelector(state => state.modal.isPageLoading)

  // states
  const [flashSales, setFlashSales] = useState<FlashSaleWithProducts[]>([])
  const [selectedFlashSales, setSelectedFlashSales] = useState<string[]>([])
  const [loadingFlashSales, setLoadingFlashSales] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

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
        const { flashSales } = await getAllFlashSalesApi()

        // set flash sales to state
        setFlashSales(flashSales)
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
        const { deletedFlashSales, message } = await deleteFlashSalesApi(ids, productIds)

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
        setSelectedFlashSales([])
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
      <AdminHeader title='All Flash Sales' addLink='/admin/flash-sale/add' />

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
                onClick={() => setIsOpenConfirmModal(true)}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      <div className='pt-9' />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Delete Flash Sales'
        content='Are you sure that you want to delete these flash sales?'
        onAccept={() => handleDeleteFlashSales(selectedFlashSales)}
        isLoading={loadingFlashSales.length > 0}
      />

      {/* MAIN LIST */}
      <div className='grid items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-21 '>
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
