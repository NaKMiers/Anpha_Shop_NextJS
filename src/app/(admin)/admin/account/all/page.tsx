'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AccountItem from '@/components/admin/AccountItem'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IAccount } from '@/models/AccountModel'
import { activateAccountsApi, deleteAccountsApi, getAllAccountsApi } from '@/requests'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaFilter, FaSearch } from 'react-icons/fa'
import { ProductWithTagsAndCategory } from '../../product/all/page'

export type AccountWithProduct = IAccount & { type: ProductWithTagsAndCategory }

function AllAccountsPage() {
  // store
  const dispatch = useAppDispatch()

  // states
  const [accounts, setAccounts] = useState<AccountWithProduct[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      search: '',
    },
  })

  // get all accounts
  useEffect(() => {
    const getAllTags = async () => {
      dispatch(setPageLoading(true))

      try {
        // sent request to server
        const { accounts } = await getAllAccountsApi() // cache: no-store

        // update accounts from state
        setAccounts(accounts)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        dispatch(setPageLoading(false))
      }
    }
    getAllTags()
  }, [dispatch])

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

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + A
      if (event.ctrlKey && event.key === 'a') {
        event.preventDefault() // Prevent the default action
        setSelectedAccounts(prev =>
          prev.length === accounts.length ? [] : accounts.map(account => account._id)
        )
      }

      // Delete
      if (event.key === 'Delete') {
        event.preventDefault() // Prevent the default aconti
        handleDeleteAccounts(selectedAccounts)
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [accounts, selectedAccounts, handleDeleteAccounts])

  return (
    <div className='w-full'>
      <AdminHeader title='All Accounts' addLink='/admin/account/add' />

      <Pagination />

      <div className='pt-8' />

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

          {/* Select Filter */}
          <div className='flex justify-end items-center flex-wrap gap-3'>{/* Select */}</div>
          <div className='flex justify-end md:justify-start items-center'>
            {/* Filter Button */}
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
        title='Delete Accounts'
        content='Are you sure that you want to delete these accounts?'
        onAccept={() => handleDeleteAccounts(selectedAccounts)}
        isLoading={loadingAccounts.length > 0}
      />

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
