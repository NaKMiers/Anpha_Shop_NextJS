'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AccountItem from '@/components/admin/AccountItem'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IAccount } from '@/models/AccountModel'
import { IProduct } from '@/models/ProductModel'
import { activateAccountsApi, deleteAccountsApi, getAllAccountsApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { usePathname, useRouter } from 'next/navigation'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BiReset } from 'react-icons/bi'
import { FaFilter, FaSearch, FaSort } from 'react-icons/fa'
import { ProductWithTagsAndCategory } from '../../product/all/page'
import { GroupTypes } from '../add/page'

export type AccountWithProduct = IAccount & { type: ProductWithTagsAndCategory }

function AllAccountsPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [accounts, setAccounts] = useState<AccountWithProduct[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [types, setTypes] = useState<IProduct[]>([])
  const [groupTypes, setGroupTypes] = useState<GroupTypes>({})
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  // loading & opening
  const [loadingAccounts, setLoadingAccounts] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 9

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
      active: '',
      usingUser: '',
    },
  })

  // get all accounts at first time
  useEffect(() => {
    // get all accounts
    const getAllAccounts = async () => {
      const query = handleQuery(searchParams)
      console.log(query)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // sent request to server
        const { accounts, amount, types } = await getAllAccountsApi(query) // cache: no-store

        // group product be category.title
        const groupTypes: GroupTypes = {}
        types.forEach((product: ProductWithTagsAndCategory) => {
          if (!groupTypes[product.category.title]) {
            groupTypes[product.category.title] = []
          }
          groupTypes[product.category.title].push(product)
        })

        console.log('groupTypes: ', groupTypes)

        Object.keys(groupTypes).map(group => {
          console.log('group: ', group)
        })

        // count length of types from gropTypes

        // update accounts from state
        setAccounts(accounts)
        setAmount(amount)
        setGroupTypes(groupTypes)
        setTypes(types)
        setSelectedTypes(
          []
            .concat((searchParams?.type || types.map((type: IProduct) => type._id)) as [])
            .map(type => type)
        )
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllAccounts()
  }, [dispatch, searchParams])

  // activate account
  const handleActivateAccounts = useCallback(async (ids: string[], value: boolean) => {
    try {
      // senred request to server
      const { updatedAccounts, message } = await activateAccountsApi(ids, value)

      // update accounts from state
      setAccounts(prev =>
        prev.map(account =>
          updatedAccounts.map((account: AccountWithProduct) => account._id).includes(account._id)
            ? { ...account, active: value }
            : account
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // delete account
  const handleDeleteAccounts = useCallback(async (ids: string[]) => {
    setLoadingAccounts(ids)

    try {
      // senred request to server
      const { deletedAccounts, message } = await deleteAccountsApi(ids)

      // remove deleted tags from state
      setAccounts(prev =>
        prev.filter(
          account =>
            !deletedAccounts.map((account: AccountWithProduct) => account._id).includes(account._id)
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingAccounts([])
      setSelectedAccounts([])
    }
  }, [])

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    async data => {
      console.log(data)
      console.log({ ...searchParams, ...data, type: selectedTypes })

      // handle query
      const query = handleQuery({ ...searchParams, ...data, type: selectedTypes })

      console.log(query)

      router.push(pathname + query)
    },
    [searchParams, selectedTypes, router, pathname]
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
        setSelectedAccounts(prev =>
          prev.length === accounts.length ? [] : accounts.map(account => account._id)
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
  }, [accounts, selectedAccounts, handleDeleteAccounts, handleFilter, handleSubmit, handleResetFilter])

  // check all types of category selected
  const checkAllTypesOfCategorySelected = useCallback(
    (group: any): boolean => {
      return group.map((type: IProduct) => type._id).every((type: any) => selectedTypes.includes(type))
    },
    [selectedTypes]
  )

  return (
    <div className='w-full'>
      {/* Top & Pagination */}
      <AdminHeader title='All Accounts' addLink='/admin/account/add' />
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      {/* Filter */}
      <div className='mt-8 bg-white self-end w-full rounded-medium shadow-md text-dark overflow-auto transition-all duration-300 no-scrollbar p-21 max-w-ful'>
        <div className='grid grid-cols-12 gap-21'>
          {/* Search */}
          <div className='flex flex-col col-span-12 md:col-span-4'>
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

          {/* Type Selection */}
          <div className='flex justify-end items-end gap-1 flex-wrap max-h-[186px] md:max-h-[148px] lg:max-h-[110px] overflow-auto col-span-12 md:col-span-8'>
            <div
              className={`overflow-hidden max-w-60 text-ellipsis text-nowrap p px-2 py-1 rounded-md border cursor-pointer select-none common-transition ${
                types.length === selectedTypes.length
                  ? 'bg-dark-100 text-white border-dark-100'
                  : 'border-slate-300'
              }`}
              title='All Types'
              onClick={() =>
                setSelectedTypes(
                  types.length === selectedTypes.length ? [] : types.map(type => type._id)
                )
              }>
              All
            </div>
            {Object.keys(groupTypes).map(key => (
              <Fragment key={key}>
                <div
                  className={`ml-2 overflow-hidden max-w-60 text-ellipsis text-nowrap p px-2 py-1 rounded-md border cursor-pointer select-none common-transition ${
                    checkAllTypesOfCategorySelected(groupTypes[key])
                      ? 'bg-dark-100 text-white border-dark-100'
                      : 'border-slate-300 bg-slate-200'
                  }`}
                  title={key}
                  onClick={() =>
                    checkAllTypesOfCategorySelected(groupTypes[key])
                      ? // remove all types of category
                        setSelectedTypes(prev =>
                          prev.filter(id => !groupTypes[key].map(type => type._id).includes(id))
                        )
                      : // add all types of category
                        setSelectedTypes(prev => [...prev, ...groupTypes[key].map(type => type._id)])
                  }>
                  {key}
                </div>
                {groupTypes[key].map(type => (
                  <div
                    className={`overflow-hidden max-w-60 text-ellipsis text-nowrap p px-2 py-1 rounded-md border cursor-pointer select-none common-transition ${
                      selectedTypes.includes(type._id)
                        ? 'bg-secondary text-white border-secondary'
                        : 'border-slate-300'
                    }`}
                    title={type.title}
                    key={type._id}
                    onClick={
                      selectedTypes.includes(type._id)
                        ? () => setSelectedTypes(prev => prev.filter(id => id !== type._id))
                        : () => setSelectedTypes(prev => [...prev, type._id])
                    }>
                    {type.title}
                  </div>
                ))}
              </Fragment>
            ))}
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
                  value: true,
                  label: 'On',
                },
                {
                  value: false,
                  label: 'Off',
                },
              ]}
            />

            {/* Using */}
            <Input
              id='usingUser'
              label='Using'
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
                  value: true,
                  label: 'Using',
                },
                {
                  value: false,
                  label: 'Empty',
                },
              ]}
            />
          </div>

          <div className='flex justify-end gap-2 items-center col-span-12 md:col-span-4'>
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

          <div className='flex justify-end flex-wrap items-center gap-2 col-span-12'>
            {/* Select All Button */}
            <button
              className='border border-sky-400 text-sky-400 rounded-lg px-3 py-2 hover:bg-sky-400 hover:text-light common-transition'
              title='Alt + A'
              onClick={() =>
                setSelectedAccounts(
                  selectedAccounts.length > 0 ? [] : accounts.map(account => account._id)
                )
              }>
              {selectedAccounts.length > 0 ? 'Unselect All' : 'Select All'}
            </button>

            {/* Activate Many Button */}
            {selectedAccounts.some(id => !accounts.find(account => account._id === id)?.active) && (
              <button
                className='border border-green-400 text-green-400 rounded-lg px-3 py-2 hover:bg-green-400 hover:text-light common-transition'
                onClick={() => handleActivateAccounts(selectedAccounts, true)}>
                Activate
              </button>
            )}

            {/* Deactivate Many Button */}
            {selectedAccounts.some(id => accounts.find(account => account._id === id)?.active) && (
              <button
                className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'
                onClick={() => handleActivateAccounts(selectedAccounts, false)}>
                Deactivate
              </button>
            )}

            {/* Delete Many Button */}
            {!!selectedAccounts.length && (
              <button
                className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'
                title='Alt + Delete'
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
        title='Delete Accounts'
        content='Are you sure that you want to delete these accounts?'
        onAccept={() => handleDeleteAccounts(selectedAccounts)}
        isLoading={loadingAccounts.length > 0}
      />

      {/* Amount */}
      <div className='p-3 text-sm text-right text-white font-semibold'>
        {itemPerPage * +(searchParams?.page || 1) > amount
          ? amount
          : itemPerPage * +(searchParams?.page || 1)}
        /{amount} account{amount > 1 && 's'}
      </div>

      {/* MAIN LIST */}
      <div className='grid gap-21 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start'>
        {accounts.map(account => (
          <AccountItem
            data={account}
            loadingAccounts={loadingAccounts}
            // selected
            selectedAccounts={selectedAccounts}
            setSelectedAccounts={setSelectedAccounts}
            // functions
            handleActivateAccounts={handleActivateAccounts}
            handleDeleteAccounts={handleDeleteAccounts}
            key={account._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllAccountsPage
