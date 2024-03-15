'use client'

import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import { formatPrice } from '@/utils/formatNumber'
import { Menu, MenuItem } from '@mui/material'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import {
  FaArrowLeft,
  FaCalendar,
  FaCaretDown,
  FaCheck,
  FaCheckSquare,
  FaFilter,
  FaSearch,
} from 'react-icons/fa'
import { FaX } from 'react-icons/fa6'
import { IoMdCode } from 'react-icons/io'

function AllOrderPage() {
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
  const open1 = Boolean(anchorEl1)
  const open2 = Boolean(anchorEl2)

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

  const handleFilter = useCallback(() => {}, [])

  return (
    <div className='w-full'>
      <div className='flex items-center mb-3'>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-white hover:text-primary'
          href='/admin'>
          <FaArrowLeft />
          Admin
        </Link>
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
              <span className='font-bold'>Giá: </span>
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
          <div className='flex gap-2'>
            <Input
              id='from'
              label='From'
              disabled={false}
              register={register}
              errors={errors}
              required
              type='date'
              icon={FaCalendar}
              className='w-full'
            />

            <Input
              id='to'
              label='To'
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
              Danh mục
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
              Sắp xếp
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
            <button className='border border-slate-300 rounded-lg px-3 py-2 hover:bg-slate-300 hover:text-light common-transition'>
              Cancel
            </button>
            <button className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className='pt-9' />

      <div className='flex items-center justify-center gap-4 text-light'>
        <div className='flex items-center gap-2'>
          <span className='font-semibold'>From: </span>
          <input
            type='date'
            className='bg-white rounded-lg px-3 h-[40px] text-dark outline-none font-semibold cursor-pointer'
            value={new Date().toISOString().split('T')[0]}
            onChange={() => {}}
          />
        </div>
        <button className='rounded-lg font-semibold px-3 py-2 bg-secondary hover:bg-primary hover:text-dark common-transition'>
          Day Income
        </button>
        <button className='rounded-lg font-semibold px-3 py-2 bg-secondary hover:bg-primary hover:text-dark common-transition'>
          Month Income
        </button>
        <button className='rounded-lg font-semibold px-3 py-2 bg-secondary hover:bg-primary hover:text-dark common-transition'>
          Year Income
        </button>
      </div>

      <div className='pt-9' />

      <div className='bg-white rounded-medium shadow-medium p-21'>
        <table className='w-full text-center text-[14px]' cellPadding={4}>
          <thead className='border-b border-slate-300'>
            <tr>
              <th>
                <input type='checkbox' className='size-4' />
              </th>
              <th>Date(d/m/y)</th>
              <th>Code</th>
              <th>Status</th>
              <th>Email</th>
              <th>UserId</th>
              <th>Total</th>
              <th>Voucher</th>
              <th>Quantity</th>
              <th>Method</th>
              <th>Last updated(d/m/y)</th>
              <th>-</th>
            </tr>
          </thead>

          <tbody className='align-top'>
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index}>
                <td>
                  <input type='checkbox' className='size-4 cursor-pointer' />
                </td>
                <td>14/03/2024 13:36:33 </td>
                <td>
                  <span className='font-semibold text-primary'>9F422</span>
                </td>
                <td>
                  <span className='font-bold text-slate-400'>cancel</span>
                </td>
                <td>veronabui26@gmail.con </td>
                <td className='flex justify-center'>
                  <FaCheckSquare size={18} className='text-green-500' />
                  {/* <FaX size={18} className='text-red-500' /> */}
                </td>
                <td>
                  <span className='text-green-600 font-semibold'>{formatPrice(9000)}</span>
                </td>
                <td className='flex justify-center'>
                  {/* <FaCheckSquare size={18} className='text-green-500' /> */}
                  <FaX size={18} className='text-red-500' />
                </td>
                <td>1</td>
                <td>momo</td>
                <td>14/03/2024 13:41:26</td>
                <td className='flex flex-col gap-2'>
                  <Link href='/admin/order/' className='underline text-sky-400'>
                    Detail
                  </Link>
                  <Link href='/admin/order/' className='underline text-yellow-400'>
                    Deliver
                  </Link>
                  <Link href='/admin/order/' className='underline text-slate-400'>
                    Cancel
                  </Link>
                  <Link href='/admin/order/' className='underline text-red-400'>
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AllOrderPage
