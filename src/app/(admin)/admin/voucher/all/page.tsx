'use client'

import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import VoucherItem from '@/components/admin/VoucherItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/loadingReducer'
import { IVoucher } from '@/models/VoucherModel'
import { formatPrice } from '@/utils/formatNumber'
import { formatTime } from '@/utils/formatTime'
import axios from 'axios'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaCalendar, FaCheck, FaFilter, FaPlus, FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'

export type VoucherWithOwner = IVoucher & { owner: { firstname: string; lastname: string } }

function AllVouchersPage() {
  // store
  const dispatch = useAppDispatch()

  const [vouchers, setVouchers] = useState<VoucherWithOwner[]>([])
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([])
  const [loadingVouchers, setLoadingVouchers] = useState<string[]>([])

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
        const res = await axios.get('/api/admin/voucher/all')
        setVouchers(res.data.vouchers)

        console.log(res.data)
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
      const res = await axios.post(`/api/admin/voucher/activate`, { ids, value })
      const { updatedVouchers, message } = res.data
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
      const res = await axios.delete(`/api/admin/voucher/delete`, { data: { ids } })
      const { deletedVouchers, message } = res.data

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
      <div className='flex items-end mb-3 gap-3'>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-white hover:text-primary'
          href='/admin'>
          <FaArrowLeft />
          Admin
        </Link>
        <div className='py-2 px-3 text-light border border-slate-300 rounded-lg text-2xl'>
          All Vouchers
        </div>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'
          href='/admin/voucher/add'>
          <FaPlus />
          Add
        </Link>
      </div>

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
          <div className='flex justify-end items-center flex-wrap gap-3'>Select</div>
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
            <button
              className='border border-green-400 text-green-400 rounded-lg px-3 py-2 hover:bg-green-400 hover:text-light common-transition'
              onClick={() => handleActivateVouchers(selectedVouchers, true)}>
              Activate
            </button>

            {/* Deactivate Many Button */}
            <button
              className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'
              onClick={() => handleActivateVouchers(selectedVouchers, false)}>
              Deactivate
            </button>

            {/* Delete Many Button */}
            <button
              className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'
              onClick={() => {
                handleDeleteVouchers(selectedVouchers)
              }}>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className='pt-9' />

      <div className='grid grid-cols-2 gap-21 lg:grid-cols-3'>
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
