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
import { formatPrice } from '@/utils/number'
import { handleQuery } from '@/utils/handleQuery'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BiReset } from 'react-icons/bi'
import { FaCalendar, FaFilter, FaSearch, FaSort } from 'react-icons/fa'

export type VoucherWithOwner = IVoucher & { owner: { firstname: string; lastname: string } }

function AllVouchersPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [vouchers, setVouchers] = useState<VoucherWithOwner[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([])

  // loading and confirming
  const [loadingVouchers, setLoadingVouchers] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 9
  const [minMinTotal, setMinMinTotal] = useState<number>(0)
  const [maxMinTotal, setMaxMinTotal] = useState<number>(0)
  const [minTotal, setMinTotal] = useState<number>(0)

  const [minMaxReduce, setMinMaxReduce] = useState<number>(0)
  const [maxMaxReduce, setMaxMaxReduce] = useState<number>(0)
  const [maxReduce, setMaxReduce] = useState<number>(0)

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
      type: '',
      active: '',
      timesLeft: '',
      beginFrom: '',
      beginTo: '',
      expireFrom: '',
      expireTo: '',
    },
  })

  // get all vouchers
  useEffect(() => {
    // get all vouchers
    const getAllVouchers = async () => {
      const query = handleQuery(searchParams)
      console.log(query)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        const { vouchers, amount, chops } = await getAllVouchersApi(query) // cache: no-store

        // set vouchers to state
        setVouchers(vouchers)
        setAmount(amount)

        // get min - max
        setMinMinTotal(chops.minMinTotal)
        setMaxMinTotal(chops.maxMinTotal)
        setMinTotal(searchParams?.minTotal ? +searchParams.minTotal : chops.maxMinTotal)

        setMinMaxReduce(chops.minMaxReduce)
        setMaxMaxReduce(chops.maxMaxReduce)
        setMaxReduce(searchParams?.maxReduce ? +searchParams.maxReduce : chops.maxMaxReduce)
      } catch (err: any) {
        console.log(err)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllVouchers()
  }, [dispatch, searchParams])

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
      toast.error(err.message)
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
      toast.error(err.message)
    } finally {
      setLoadingVouchers([])
      setSelectedVouchers([])
    }
  }, [])

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    async data => {
      console.log(data)
      const { beginFrom, beginTo, expireFrom, expireTo, ...rest } = data

      rest.begin = (beginFrom || '') + '|' + (beginTo || '')
      rest.expire = (expireFrom || '') + '|' + (expireTo || '')
      console.log(rest)

      // handle query
      const query = handleQuery({
        ...searchParams,
        ...rest,
        minTotal: minTotal === maxMinTotal ? [] : [minTotal.toString()],
        maxReduce: maxReduce === maxMaxReduce ? [] : [maxReduce.toString()],
      })

      console.log(query)

      router.push(pathname + query)
    },
    [router, searchParams, minTotal, maxReduce, pathname, maxMinTotal, maxMaxReduce]
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
        setSelectedVouchers(prev =>
          prev.length === vouchers.length ? [] : vouchers.map(voucher => voucher._id)
        )
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
  }, [handleFilter, handleResetFilter, handleSubmit, vouchers])

  return (
    <div className='w-full'>
      {/* Top & Pagination */}
      <AdminHeader title='All Vouchers' addLink='/admin/voucher/add' />
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      {/* Filter */}
      <div className='mt-8 bg-white self-end w-full rounded-medium shadow-md text-dark overflow-auto transition-all duration-300 no-scrollbar p-21 max-w-ful'>
        <div className='grid grid-cols-12 gap-21'>
          {/* Search */}
          <div className='flex flex-col col-span-12'>
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

          {/* Min Total */}
          <div className='flex flex-col col-span-12 md:col-span-6'>
            <label htmlFor='minTotal'>
              <span className='font-bold'>Min Total: </span>
              <span>{formatPrice(minTotal || maxMinTotal)}</span> -{' '}
              <span>{formatPrice(maxMinTotal)}</span>
            </label>
            <input
              id='minTotal'
              className='input-range h-2 bg-slate-200 rounded-lg my-2'
              placeholder=' '
              disabled={false}
              type='range'
              min={minMinTotal || 0}
              max={maxMinTotal || 0}
              value={minTotal}
              onChange={e => setMinTotal(+e.target.value)}
            />
          </div>

          {/* Max Reduce */}
          <div className='flex flex-col col-span-12 md:col-span-6'>
            <label htmlFor='maxReduce'>
              <span className='font-bold'>Max Reduce: </span>
              <span>{formatPrice(maxReduce || maxMaxReduce)}</span> -{' '}
              <span>{formatPrice(maxMaxReduce)}</span>
            </label>
            <input
              id='maxReduce'
              className='input-range h-2 bg-slate-200 rounded-lg my-2'
              placeholder=' '
              disabled={false}
              type='range'
              min={minMaxReduce || 0}
              max={maxMaxReduce || 0}
              value={maxReduce}
              onChange={e => setMaxReduce(+e.target.value)}
            />
          </div>

          {/* Begin */}
          <div className='flex flex-wrap sm:flex-nowrap gap-2 col-span-12 lg:col-span-6'>
            <Input
              id='beginFrom'
              label='Begin From'
              disabled={false}
              register={register}
              errors={errors}
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
              type='date'
              icon={FaCalendar}
              className='w-full'
            />
          </div>

          {/* Expire */}
          <div className='flex flex-wrap sm:flex-nowrap gap-2 col-span-12 lg:col-span-6'>
            <Input
              id='expireFrom'
              label='Expire From'
              disabled={false}
              register={register}
              errors={errors}
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

            {/* Times Left */}
            <Input
              id='timesLeft'
              label='Times Left'
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
                  label: 'Still',
                },
                {
                  value: 'false',
                  label: 'Run Out',
                },
              ]}
            />

            {/* Type */}
            <Input
              id='type'
              label='Type'
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
                  value: 'percentage',
                  label: 'Percentage',
                },
                {
                  value: 'fixed-reduce',
                  label: 'Fixed Reduce',
                },
                {
                  value: 'fixed',
                  label: 'Fixed',
                },
              ]}
            />

            {/* Active */}
            <Input
              id='active'
              label='Active'
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

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Delete Vouchers'
        content='Are you sure that you want to delete these vouchers?'
        onAccept={() => handleDeleteVouchers(selectedVouchers)}
        isLoading={loadingVouchers.length > 0}
      />

      {/* Amount */}
      <div className='p-3 text-sm text-right text-white font-semibold'>
        {itemPerPage * +(searchParams?.page || 1) > amount
          ? amount
          : itemPerPage * +(searchParams?.page || 1)}
        /{amount} voucher{amount > 1 ? 's' : ''}
      </div>

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
