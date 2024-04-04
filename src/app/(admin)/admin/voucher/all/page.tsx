'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import VoucherItem from '@/components/admin/VoucherItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IVoucher } from '@/models/VoucherModel'
import { activateVouchersApi, deleteVouchersApi, getAllVouchersApi } from '@/requests'
import { formatPrice } from '@/utils/formatNumber'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCalendar, FaFilter } from 'react-icons/fa'

export type VoucherWithOwner = IVoucher & { owner: { firstname: string; lastname: string } }

function AllVouchersPage() {
  // store
  const dispatch = useAppDispatch()

  // states
  const [vouchers, setVouchers] = useState<VoucherWithOwner[]>([])
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([])
  const [loadingVouchers, setLoadingVouchers] = useState<string[]>([])
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

  // get all vouchers
  useEffect(() => {
    dispatch(setPageLoading(true))

    const getAllVouchers = async () => {
      try {
        const { vouchers } = await getAllVouchersApi()
        setVouchers(vouchers)
      } catch (err: any) {
        console.log(err)
      } finally {
        dispatch(setPageLoading(false))
      }
    }
    getAllVouchers()
  }, [dispatch])

  // activate voucher
  const handleActivateVouchers = useCallback(async (ids: string[], value: boolean) => {
    try {
      // senred request to server
      const { updatedVouchers, message } = await activateVouchersApi(ids, value)
      console.log(updatedVouchers, message)

      // update vouchers from state
      setVouchers(prev =>
        prev.map(voucher =>
          updatedVouchers.map((voucher: VoucherWithOwner) => voucher._id).includes(voucher._id)
            ? { ...voucher, active: value }
            : voucher
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }, [])

  // delete voucher
  const handleDeleteVouchers = useCallback(async (ids: string[]) => {
    setLoadingVouchers(ids)

    try {
      // senred request to server
      const { deletedVouchers, message } = await deleteVouchersApi(ids)

      // remove deleted vouchers from state
      setVouchers(prev =>
        prev.filter(
          voucher => !deletedVouchers.map((voucher: IVoucher) => voucher._id).includes(voucher._id)
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    } finally {
      setLoadingVouchers([])
      setSelectedVouchers([])
    }
  }, [])

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + A
      if (event.ctrlKey && event.key === 'a') {
        event.preventDefault() // Prevent the default action
        setSelectedVouchers(prev =>
          prev.length === vouchers.length ? [] : vouchers.map(voucher => voucher._id)
        )
      }

      // Delete
      if (event.key === 'Delete') {
        event.preventDefault() // Prevent the default aconti
        handleDeleteVouchers(selectedVouchers)
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [vouchers, selectedVouchers, handleDeleteVouchers])

  return (
    <div className='w-full'>
      <AdminHeader title='All Vouchers' addLink='/admin/voucher/add' />

      <Pagination />

      <div className='pt-8' />

      <div className='bg-white self-end w-full rounded-medium shadow-md text-dark overflow-auto transition-all duration-300 no-scrollbar p-21 max-w-ful'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-21'>
          <div className='flex flex-col'>
            <label>
              <span className='font-bold'>Min Total: </span>
              <span>{formatPrice(35000)}</span> - <span>{formatPrice(60000)}</span>
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
          <div className='flex flex-col'>
            <label>
              <span className='font-bold'>Max Reduce: </span>
              <span>{formatPrice(10000)}</span> - <span>{formatPrice(15000)}</span>
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
                setSelectedVouchers(
                  selectedVouchers.length > 0 ? [] : vouchers.map(voucher => voucher._id)
                )
              }>
              {selectedVouchers.length > 0 ? 'Unselect All' : 'Select All'}
            </button>

            {/* Activate Many Button */}
            {selectedVouchers.some(id => !vouchers.find(voucher => voucher._id === id)?.active) && (
              <button
                className='border border-green-400 text-green-400 rounded-lg px-3 py-2 hover:bg-green-400 hover:text-light common-transition'
                onClick={() => handleActivateVouchers(selectedVouchers, true)}>
                Activate
              </button>
            )}

            {/* Deactivate Many Button */}
            {selectedVouchers.some(id => vouchers.find(voucher => voucher._id === id)?.active) && (
              <button
                className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'
                onClick={() => handleActivateVouchers(selectedVouchers, false)}>
                Deactivate
              </button>
            )}

            {/* Delete Many Button */}
            {!!selectedVouchers.length && (
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
        title='Delete Vouchers'
        content='Are you sure that you want to delete these vouchers?'
        onAccept={() => handleDeleteVouchers(selectedVouchers)}
        isLoading={loadingVouchers.length > 0}
      />

      {/* MAIN (LIST) */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-21'>
        {vouchers.map(voucher => (
          <VoucherItem
            data={voucher}
            loadingVouchers={loadingVouchers}
            selectedVouchers={selectedVouchers}
            setSelectedVouchers={setSelectedVouchers}
            handleActivateVouchers={handleActivateVouchers}
            handleDeleteVouchers={handleDeleteVouchers}
            key={voucher._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllVouchersPage
