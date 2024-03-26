'use client'

import { formatPrice } from '@/utils/formatNumber'
import { Menu, MenuItem } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { FaCaretDown, FaFilter } from 'react-icons/fa6'

interface MetaProps {
  title?: string
  className?: string
}

function Meta({ title, className = '' }: MetaProps) {
  const [price, setPrice] = useState(9000)

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

  // handle filter
  const handleFilter = useCallback(() => {}, [])

  return (
    <div className={`p-21 bg-white rounded-medium shadow-medium text-dark overflow-auto ${className}`}>
      <h1 className='text-secondary text-3xl font-semibold tracking-wide mb-2'>{title}</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-21'>
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
            <FaCaretDown size={16} className='ml-1 text-dark group-hover:text-light common-transition' />
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
            <FaCaretDown size={16} className='ml-1 text-dark group-hover:text-light common-transition' />
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
            <FaFilter size={14} className='ml-1 text-light group-hover:text-dark common-transition' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Meta
