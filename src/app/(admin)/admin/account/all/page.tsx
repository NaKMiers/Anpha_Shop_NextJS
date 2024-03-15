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
  FaPlus,
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
          All Accounts
        </div>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'
          href='/admin/account/add'>
          <FaPlus />
          Add
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
            <button className='border border-green-400 text-green-400 rounded-lg px-3 py-2 hover:bg-green-400 hover:text-light common-transition'>
              Active
            </button>
            <button className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'>
              Deactive
            </button>
          </div>
        </div>
      </div>

      <div className='pt-9' />

      <div className='bg-white rounded-medium shadow-medium p-21'>
        <table className='w-full text-center text-[14px]' cellPadding={4}>
          <thead className='border-b border-slate-300'>
            <tr>
              <th className='w-12 text-start'>
                <input type='checkbox' className='size-4' />
              </th>
              <th>Active</th>
              <th>Type</th>
              <th>Info</th>
              <th>
                <span>Begin</span>
                <br />
                <span>(d/m/y)</span>
              </th>
              <th>
                <span>Begin</span>
                <br />
                <span>(d/m/y)</span>
              </th>
              <th>
                <span>Begin</span>
                <br />
                <span>(d/m/y)</span>
              </th>
              <th>Using Users</th>
              <th>-</th>
            </tr>
          </thead>

          <tbody className='align-top'>
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index}>
                <td className='text-start'>
                  <input type='checkbox' className='size-4 cursor-pointer' />
                </td>
                <td className='flex justify-center'>
                  <FaCheckSquare size={18} className='text-green-500' />
                  {/* <FaX size={18} className='text-red-500' /> */}
                </td>
                <td className='text-start'>
                  Grammarly Premium (1 Tháng) - Đánh Bại Lỗi Ngữ Pháp Với Ưu Đãi Đặc Biệt
                </td>
                <td className='text-start'>
                  ✅Email: bowczarski@springfieldcollege.edu ✅Password: Gram@123
                </td>
                <td>14/03/2024 14:38:02</td>
                <td>21/03/2024 14:38:02</td>
                <td>30/04/2024 21:38:00</td>
                <td>nhatanhdiep@yahoo.com </td>
                <td className='flex flex-col gap-2'>
                  <Link href='/admin/order/' className='underline text-sky-400'>
                    Edit
                  </Link>
                  <Link href='/admin/order/' className='underline text-red-400'>
                    Delete
                  </Link>
                  <Link href='/admin/order/' className='underline text-red-400'>
                    Deactive
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
