'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import UserItem from '@/components/admin/UserItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IUser } from '@/models/UserModel'
import { formatPrice } from '@/utils/formatNumber'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaFilter, FaSearch } from 'react-icons/fa'

function AllUsersPage() {
  // hook
  const { data: session } = useSession()
  const curUser: any = session?.user
  const dispatch = useAppDispatch()

  // states
  const [users, setUsers] = useState<IUser[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [loadingUsers, setLoadingUsers] = useState<string[]>([])
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

  // get all users
  useEffect(() => {
    const getAllUsers = async () => {
      dispatch(setPageLoading(true))

      console.log('get all users')
      try {
        const res = await axios.get('/api/admin/user/all')
        setUsers(res.data.users)
      } catch (err: any) {
        console.log(err.message)
      } finally {
        dispatch(setPageLoading(false))
      }
    }
    getAllUsers()
  }, [dispatch])

  // delete user
  const handleDeleteUsers = useCallback(async (ids: string[]) => {
    setLoadingUsers(ids)

    try {
      // senred request to server
      const res = await axios.delete(`/api/admin/user/delete`, { data: { ids } })
      const { deletedUsers, message } = res.data

      // remove deleted users from state
      setUsers(prev =>
        prev.filter(user => !deletedUsers.map((user: IUser) => user._id).includes(user._id))
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    } finally {
      setLoadingUsers([])
      setSelectedUsers([])
    }
  }, [])

  // handle select all users
  const handleSelectAllUsers = useCallback(() => {
    setSelectedUsers(
      selectedUsers.length > 0
        ? []
        : users.filter(user => user._id !== curUser?._id).map(user => user._id)
    )
  }, [curUser?._id, users, selectedUsers.length])

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + A
      if (event.ctrlKey && event.key === 'a') {
        event.preventDefault() // Prevent the default action
        handleSelectAllUsers()
      }

      // Delete
      if (event.key === 'Delete') {
        event.preventDefault() // Prevent the default aconti
        handleDeleteUsers(selectedUsers)
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [users, selectedUsers, handleDeleteUsers, handleSelectAllUsers])

  return (
    <div className='w-full'>
      <AdminHeader title='All Users' />

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
          <div className='flex flex-col'>
            <label>
              <span className='font-bold'>Balance: </span>
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
              onChange={e => {}}
            />
          </div>
          <div className='flex flex-col'>
            <label>
              <span className='font-bold'>Accumulated: </span>
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
              onChange={e => {}}
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

      <div className='pt-9' />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Delete Users'
        content='Are you sure that you want to deleted these users?'
        onAccept={() => handleDeleteUsers(selectedUsers)}
        isLoading={loadingUsers.length > 0}
      />

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
