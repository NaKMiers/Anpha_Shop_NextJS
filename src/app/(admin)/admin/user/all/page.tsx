'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import UserItem from '@/components/admin/UserItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IUser } from '@/models/UserModel'
import { deleteUsersApi, getAllUsersApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { handleQuery } from '@/utils/handleQuery'
import { getSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BiReset } from 'react-icons/bi'
import { FaFilter, FaSearch, FaSort } from 'react-icons/fa'

function AllUsersPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // hook
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // user session
  const [curUser, setCurUser] = useState<any>({})

  // states
  const [users, setUsers] = useState<IUser[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // loading and confirming
  const [loadingUsers, setLoadingUsers] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 9
  const [minBalance, setMinBalance] = useState<number>(0)
  const [maxBalance, setMaxBalance] = useState<number>(0)
  const [balance, setBalance] = useState<number>(0)
  const [minAccumulated, setMinAccumulated] = useState<number>(0)
  const [maxAccumulated, setMaxAccumulated] = useState<number>(0)
  const [accumulated, setAccumulated] = useState<number>(0)

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
      role: '',
    },
  })

  // get user session
  useEffect(() => {
    const getCurUser = async () => {
      const session = await getSession()
      setCurUser(session?.user)
    }
    getCurUser()
  }, [])

  // get all users
  useEffect(() => {
    // get all users
    const getAllUsers = async () => {
      const query = handleQuery(searchParams)
      console.log(query)

      // start page loading
      dispatch(setPageLoading(true))

      console.log('get all users')
      try {
        const { users, amount, chops } = await getAllUsersApi(query) // cache: no-store

        // set to states
        setUsers(users)
        setAmount(amount)

        // set balance
        setMinBalance(chops.minBalance)
        setMaxBalance(chops.maxBalance)
        setBalance(searchParams?.balance ? +searchParams.balance : chops.maxBalance)

        // set accumulated
        setMinAccumulated(chops.minAccumulated)
        setMaxAccumulated(chops.maxAccumulated)
        setAccumulated(searchParams?.accumulated ? +searchParams.accumulated : chops.maxAccumulated)
      } catch (err: any) {
        console.log(err)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllUsers()
  }, [dispatch, searchParams])

  // delete user
  const handleDeleteUsers = useCallback(async (ids: string[]) => {
    setLoadingUsers(ids)

    try {
      // senred request to server
      const { deletedUsers, message } = await deleteUsersApi(ids)

      // remove deleted users from state
      setUsers(prev =>
        prev.filter(user => !deletedUsers.map((user: IUser) => user._id).includes(user._id))
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingUsers([])
      setSelectedUsers([])
    }
  }, [])

  // handle select all users
  const handleSelectAllUsers = useCallback(() => {
    setSelectedUsers(
      selectedUsers.length > 0 ? [] : users.filter(user => user.role === 'user').map(user => user._id)
    )
  }, [users, selectedUsers.length])

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    async data => {
      console.log(data)
      console.log({ ...searchParams, ...data, balance, accumulated })

      // handle query
      const query = handleQuery({
        ...searchParams,
        ...data,
        balance: [balance.toString()],
        accumulated: [accumulated.toString()],
      })

      console.log(query)

      router.push(pathname + query)
    },
    [searchParams, balance, accumulated, router, pathname]
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
        handleSelectAllUsers()
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
  }, [handleFilter, handleResetFilter, handleSelectAllUsers, handleSubmit])

  return (
    <div className='w-full'>
      {/* Top & Pagination */}
      <AdminHeader title='All Users' />
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      {/* Filter */}
      <div className='mt-8 bg-white self-end w-full rounded-medium shadow-md text-dark overflow-auto transition-all duration-300 no-scrollbar p-21 max-w-ful'>
        <div className='grid grid-cols-12 gap-21'>
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

          {/* Balance */}
          <div className='flex flex-col col-span-12 md:col-span-4'>
            <label htmlFor='balance'>
              <span className='font-bold'>Balance: </span>
              <span>{formatPrice(balance || maxBalance)}</span> - <span>{formatPrice(maxBalance)}</span>
            </label>
            <input
              id='balance'
              className='input-range h-2 bg-slate-200 rounded-lg my-2'
              placeholder=' '
              disabled={false}
              type='range'
              min={minBalance || 0}
              max={maxBalance || 0}
              value={balance}
              onChange={e => setBalance(+e.target.value)}
            />
          </div>

          {/* Accumulated */}
          <div className='flex flex-col col-span-12 md:col-span-4'>
            <label htmlFor='accumulated'>
              <span className='font-bold'>Accumulated: </span>
              <span>{formatPrice(accumulated || maxAccumulated)}</span> -{' '}
              <span>{formatPrice(maxAccumulated)}</span>
            </label>
            <input
              id='accumulated'
              className='input-range h-2 bg-slate-200 rounded-lg my-2'
              placeholder=' '
              disabled={false}
              type='range'
              min={minAccumulated || 0}
              max={maxAccumulated || 0}
              value={accumulated}
              onChange={e => setAccumulated(+e.target.value)}
            />
          </div>

          {/* Select Filter */}
          <div className='flex justify-end items-center flex-wrap gap-3 col-span-12 md:col-span-8'>
            {/* Select */}

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

            {/* role */}
            <Input
              id='role'
              label='Role'
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
                  value: 'admin',
                  label: 'Admin',
                },
                {
                  value: 'editor',
                  label: 'Editor',
                },
                {
                  value: 'collaborator',
                  label: 'Collaborator',
                },
                {
                  value: 'user',
                  label: 'User',
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
              onClick={handleSelectAllUsers}>
              {selectedUsers.length > 0 ? 'Unselect All' : 'Select All'}
            </button>

            {/* Delete Many Button */}
            {!!selectedUsers.length && (
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
        title='Delete Users'
        content='Are you sure that you want to delete these users?'
        onAccept={() => handleDeleteUsers(selectedUsers)}
        isLoading={loadingUsers.length > 0}
      />

      {/* Amount */}
      <div className='p-3 text-sm text-right text-white font-semibold'>
        {itemPerPage * +(searchParams?.page || 1) > amount
          ? amount
          : itemPerPage * +(searchParams?.page || 1)}
        /{amount} user{amount > 1 && 's'}
      </div>

      {/* MAIN LIST */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-21'>
        {users.map(user => (
          <UserItem
            data={user}
            loadingUsers={loadingUsers}
            // selected
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            // functions
            handleDeleteUsers={handleDeleteUsers}
            key={user._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllUsersPage
