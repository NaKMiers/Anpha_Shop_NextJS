'use client'

import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import { formatPrice } from '@/utils/formatNumber'
import { Menu, MenuItem } from '@mui/material'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { FaArrowLeft, FaCalendar, FaCaretDown, FaCheck, FaFilter, FaPlus, FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'

function AllFlashSalesPage() {
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
        <div className='py-2 px-3 text-light border border-slate-300 rounded-lg text-2xl'>
          All Flash Sales
        </div>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'
          href='/admin/product/add'>
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
            <button className='border border-green-400 text-green-400 rounded-lg px-3 py-2 hover:bg-green-400 hover:text-light common-transition'>
              Mark
            </button>
            <button className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'>
              Unmark
            </button>
            <button className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className='pt-9' />

      <div className='grid grid-cols-2 lg:grid-cols-4 gap-21 '>
        {Array.from({ length: 5 }).map((_, index) => (
          <div className='flex flex-col p-4 rounded-lg shadow-lg bg-white' key={index}>
            <div className='font-semibold' title='netflix'>
              <span title='Value' className='font-semibold text-primary mr-2'>
                {formatPrice(10000)}
              </span>
              <span title='Time Type'>loop</span>
            </div>

            <div className='font-semibold' title='netflix'>
              <span className='mr-2' title='Type'>
                fixed-reduce
              </span>
              <span className='font-semobold text-secondary' title='duration'>
                120m
              </span>
            </div>

            <div>
              <span title='Begin (d/m/y)'>01/12/2023 16:33:00</span> {' - '}
              <span title='Begin (d/m/y)'>01/12/2023 16:33:00</span>
            </div>

            <p className='font-semibold'>
              <span>Product Quantity:</span> <span className='text-primary'>9</span>
            </p>

            <div className='flex self-end border border-dark text-dark rounded-lg px-3 py-2 gap-4'>
              <Link href='/admin/tag/:id/edit' className='block group'>
                <MdEdit size={18} className='group-hover:scale-125 common-transition' />
              </Link>
              <button className='block group'>
                <FaTrash size={18} className='group-hover:scale-125 common-transition' />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllFlashSalesPage
