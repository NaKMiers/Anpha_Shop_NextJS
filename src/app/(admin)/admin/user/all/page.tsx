'use client'

import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/loadingReducer'
import { IUser } from '@/models/UserModel'
import { formatPrice } from '@/utils/formatNumber'
import { formatTime } from '@/utils/formatTime'
import { Menu, MenuItem } from '@mui/material'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import {
  FaArrowLeft,
  FaCaretDown,
  FaFilter,
  FaPlus,
  FaPlusCircle,
  FaSearch,
  FaTrash,
} from 'react-icons/fa'
import { GrUpgrade } from 'react-icons/gr'

function AllUsersPage() {
  const dispatch = useAppDispatch()
  const [users, setUsers] = useState<IUser[]>([])
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [price, setPrice] = useState(9000)

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

  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null)
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null)
  const [anchorEl3, setAnchorEl3] = useState<null | HTMLElement>(null)
  const [anchorEl4, setAnchorEl4] = useState<null | HTMLElement>(null)
  const open1 = Boolean(anchorEl1)
  const open2 = Boolean(anchorEl2)
  const open3 = Boolean(anchorEl3)
  const open4 = Boolean(anchorEl4)

  // open menu
  const handleOpenMenu1 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl1(event.currentTarget)
  }
  // close menu
  const handleCloseMenu1 = () => {
    setAnchorEl1(null)
  }

  // open menu
  const handleOpenMenu2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget)
  }
  // close menu
  const handleCloseMenu2 = () => {
    setAnchorEl2(null)
  }

  // open menu
  const handleOpenMenu3 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget)
  }
  // close menu
  const handleCloseMenu3 = () => {
    setAnchorEl2(null)
  }

  // open menu
  const handleOpenMenu4 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget)
  }
  // close menu
  const handleCloseMenu4 = () => {
    setAnchorEl2(null)
  }

  const handleFilter = useCallback(() => {}, [])

  return (
    <div className='w-full'>
      <div className='flex items-end mb-3 gap-3'>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-white hover:text-primary'
          href='/admin'>
          <FaArrowLeft />
          Admin
        </Link>
        <div className='py-2 px-3 text-light border border-slate-300 rounded-lg text-2xl'>All Users</div>
      </div>

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
              <span>{formatPrice(price)}</span>
              {' - '}
              <span>{formatPrice(2000000)}</span>
            </label>
            <input
              className='input-range h-2 bg-slate-200 rounded-lg my-2'
              type='range'
              min='9000'
              max='2000000'
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
            />
          </div>
          <div className='flex flex-col'>
            <label>
              <span className='font-bold'>Accumulated: </span>
              <span>{formatPrice(price)}</span>
              {' - '}
              <span>{formatPrice(2000000)}</span>
            </label>
            <input
              className='input-range h-2 bg-slate-200 rounded-lg my-2'
              type='range'
              min='9000'
              max='2000000'
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
            />
          </div>
          <div className='flex justify-end items-center flex-wrap gap-3'>
            <button
              className='group flex items-center text-nowrap bg-primary text-[14px] font-semibold p-2 rounded-md cursor-pointer hover:bg-secondary hover:text-light common-transition'
              onClick={handleOpenMenu1}>
              Types
              <FaCaretDown
                size={16}
                className='ml-1 text-dark group-hover:text-light common-transition'
              />
            </button>
            <Menu
              className='mt-2'
              id='basic-menu'
              anchorEl={anchorEl1}
              open={open1}
              onClose={handleCloseMenu1}>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu1}>
                <span className='font-body'>Thông tin tài khoản</span>
              </MenuItem>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu1}>
                <span className='font-body'>Thông tin tài khoản</span>
              </MenuItem>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu1}>
                <span className='font-body'>Thông tin tài khoản</span>
              </MenuItem>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu1}>
                <span className='font-body'>Thông tin tài khoản</span>
              </MenuItem>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu1}>
                <span className='font-body'>Thông tin tài khoản</span>
              </MenuItem>
            </Menu>

            <button
              className='group flex items-center text-nowrap bg-primary text-[14px] font-semibold p-2 rounded-md cursor-pointer hover:bg-secondary hover:text-light common-transition'
              onClick={handleOpenMenu2}>
              Active
              <FaCaretDown
                size={16}
                className='ml-1 text-dark group-hover:text-light common-transition'
              />
            </button>
            <Menu
              className='mt-2'
              id='basic-menu'
              anchorEl={anchorEl2}
              open={open2}
              onClose={handleCloseMenu2}>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu2}>
                <span className='font-body'>Thông tin</span>
              </MenuItem>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu2}>
                <span className='font-body'>Thông tin</span>
              </MenuItem>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu2}>
                <span className='font-body'>Thông tin</span>
              </MenuItem>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu2}>
                <span className='font-body'>Thông tin</span>
              </MenuItem>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu2}>
                <span className='font-body'>Thông tin</span>
              </MenuItem>
            </Menu>

            <button
              className='group flex items-center text-nowrap bg-primary text-[14px] font-semibold p-2 rounded-md cursor-pointer hover:bg-secondary hover:text-light common-transition'
              onClick={handleOpenMenu3}>
              Using
              <FaCaretDown
                size={16}
                className='ml-1 text-dark group-hover:text-light common-transition'
              />
            </button>
            <Menu
              className='mt-2'
              id='basic-menu'
              anchorEl={anchorEl3}
              open={open3}
              onClose={handleCloseMenu3}>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu3}>
                <span className='font-body'>Thông tin</span>
              </MenuItem>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu3}>
                <span className='font-body'>Thông tin</span>
              </MenuItem>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu3}>
                <span className='font-body'>Thông tin</span>
              </MenuItem>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu3}>
                <span className='font-body'>Thông tin</span>
              </MenuItem>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu3}>
                <span className='font-body'>Thông tin</span>
              </MenuItem>
            </Menu>

            <button
              className='group flex items-center text-nowrap bg-primary text-[14px] font-semibold p-2 rounded-md cursor-pointer hover:bg-secondary hover:text-light common-transition'
              onClick={handleOpenMenu4}>
              Sắp xếp
              <FaCaretDown
                size={16}
                className='ml-1 text-dark group-hover:text-light common-transition'
              />
            </button>
            <Menu
              className='mt-2'
              id='basic-menu'
              anchorEl={anchorEl4}
              open={open2}
              onClose={handleCloseMenu4}>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu4}>
                <span className='font-body'>Thông tin</span>
              </MenuItem>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu4}>
                <span className='font-body'>Thông tin</span>
              </MenuItem>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu4}>
                <span className='font-body'>Thông tin</span>
              </MenuItem>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu4}>
                <span className='font-body'>Thông tin</span>
              </MenuItem>
              <MenuItem className='group flex gap-2' onClick={handleCloseMenu4}>
                <span className='font-body'>Thông tin</span>
              </MenuItem>
            </Menu>
          </div>
          <div className='flex justify-end md:justify-start items-center'>
            <button
              className='group flex items-center text-nowrap bg-secondary text-[14px] font-semibold p-2 rounded-md cursor-pointer hover:bg-primary text-light hover:text-dark common-transition'
              onClick={handleFilter}>
              Lọc
              <FaFilter size={12} className='ml-1 text-light group-hover:text-dark common-transition' />
            </button>
          </div>

          <div className='flex justify-end items-center col-span-2 gap-2'>
            <button className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'>
              Delete
            </button>
            <button className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'>
              Remove flashsales
            </button>
            <button className='border border-green-400 text-green-400 rounded-lg px-3 py-2 hover:bg-green-400 hover:text-light common-transition'>
              Activate
            </button>
            <button className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'>
              Deactivate
            </button>
          </div>
        </div>
      </div>

      <div className='pt-9' />

      <div className='grid grid-cols-2 gap-21 lg:grid-cols-3 items-start'>
        {users.map(user => (
          <div
            className='relative flex justify-between items-start gap-2 p-4 rounded-lg shadow-lg bg-white'
            key={user._id}>
            <div>
              {/* Avatar */}
              <Image
                className='aspect-square float-start mr-3 rounded-md shadow-lg'
                src={user.avatar}
                height={68}
                width={68}
                alt='thumbnail'
              />

              {/* Infomation */}
              <div className='absolute -top-3 -left-2 text-yellow-300 bg-secondary px-2 py-px rounded-lg font-semibold'>
                {user.role}
              </div>
              <p
                className='inline font-semibold text-[18px] leading-4 font-body tracking-wide text-secondary'
                title={user.email}>
                {user.email}
              </p>
              <div className='flex items-center gap-2'>
                <p>
                  <span className='font-semibold'>Balance: </span>
                  <span className='text-green-500'>{formatPrice(user.balance)}</span>
                </p>
                <button className='group flex-shrink-0 rounded-full border-2 border-dark p-[2px] hover:scale-110 common-transition hover:border-primary'>
                  <FaPlus size={10} className='group-hover:text-primary common-transition' />
                </button>
              </div>
              <p>
                <span className='font-semibold'>Accumulated: </span>
                <span>{formatPrice(user.accumulated)}</span>
              </p>
              {user.username && (
                <p>
                  <span className='font-semibold'>Username: </span>
                  <span>{user.username}</span>
                </p>
              )}
              {(user.firstname || user.lastname) && (
                <p>
                  <span className='font-semibold'>Fullname: </span>
                  <span>{user.firstname + ' ' + user.lastname}</span>
                </p>
              )}
              {user.birthday && (
                <p>
                  <span className='font-semibold'>Birthday: </span>
                  <span>{user.birthday}</span>
                </p>
              )}
              {user.phone && (
                <p>
                  <span className='font-semibold'>Phone: </span>
                  <span>{user.phone}</span>
                </p>
              )}
              {user.address && (
                <p>
                  <span className='font-semibold'>Address: </span>
                  <span>{user.address}</span>
                </p>
              )}
              {user.job && (
                <p>
                  <span className='font-semibold'>Job: </span>
                  <span>{user.job}</span>
                </p>
              )}
              <p>
                <span className='font-semibold'>Created At: </span>
                <span>{formatTime(user.createdAt)}</span>
              </p>
              <p>
                <span className='font-semibold'>Updated At: </span>
                <span>{formatTime(user.updatedAt)}</span>
              </p>
            </div>

            <div className='flex flex-col border border-dark text-dark rounded-lg px-2 py-3 gap-4'>
              <button className='block group'>
                <FaTrash size={18} className='group-hover:scale-125 common-transition' />
              </button>
              <button className='block group'>
                <GrUpgrade size={18} className='group-hover:scale-125 common-transition' />
              </button>
              <button className='block group'>
                <FaPlusCircle size={18} className='group-hover:scale-125 common-transition' />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllUsersPage
