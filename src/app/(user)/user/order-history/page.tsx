'use client'

import Input from '@/components/Input'
import OrderItem from '@/components/OrderItem'
import { formatPrice } from '@/utils/formatNumber'
import { Menu, MenuItem } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { BsThreeDots } from 'react-icons/bs'
import { FaCaretDown, FaFilter } from 'react-icons/fa'
import { IoMdCode } from 'react-icons/io'

function OrderHistoryPage() {
  const [price, setPrice] = useState(9000)
  const [isShowFilter, setIsShowFilter] = useState(false)

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
    <div className='flex flex-col'>
      <h1 className='font-semibold text-3xl font-body tracking-wide mb-5'>LỊCH SỬ MUA HÀNG CỦA TÔI</h1>

      {/* Filter */}
      <div className='flex justify-end'>
        <button
          onClick={() => setIsShowFilter(!isShowFilter)}
          className='px-3 py-[2px] rounded-md shadow-lg ml-auto group hover:bg-primary common-transition mb-3'>
          <BsThreeDots size={28} className='group-hover:text-white common-transition' />
        </button>
      </div>
      <div
        className={`bg-white self-end w-full rounded-medium shadow-md text-dark overflow-auto transition-all duration-300 no-scrollbar ${
          isShowFilter ? 'p-21 max-w-full max-h-[300px]' : 'max-w-0 max-h-0 p-0'
        }`}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-21'>
          <div className='flex flex-col'>
            <Input
              id='orderCode'
              label='Mã hóa đơn'
              disabled={false}
              register={register}
              errors={errors}
              required
              type='text'
              icon={IoMdCode}
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
        </div>
      </div>

      <div className='pt-5' />

      {/* Order items */}
      {Array.from({ length: 5 }).map((_, index) => (
        <OrderItem className={index !== 0 ? 'mt-4' : ''} key={index} />
      ))}
    </div>
  )
}

export default OrderHistoryPage
