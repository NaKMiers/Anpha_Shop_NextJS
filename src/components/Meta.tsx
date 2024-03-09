'use client'

import { formatPrice } from '@/utils/formatNumber'
import { Menu, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import { FaCaretDown, FaChevronDown } from 'react-icons/fa6'

function Meta() {
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null)
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null)
  const open1 = Boolean(anchorEl1)
  const open2 = Boolean(anchorEl2)

  // open menu
  const handleOpenMenu1 = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl1(event.currentTarget)
  }
  // close menu
  const handleCloseMenu1 = () => {
    setAnchorEl1(null)
  }

  // open menu
  const handleOpenMenu2 = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl2(event.currentTarget)
  }
  // close menu
  const handleCloseMenu2 = () => {
    setAnchorEl2(null)
  }
  return (
    <div className='p-21 bg-white rounded-medium shadow-medium text-dark overflow-auto'>
      <h1 className='text-secondary text-3xl font-semibold tracking-wide mb-2'>Danh Mục - Netflix</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-21'>
        <div className='flex flex-col'>
          <label>
            <span className='font-bold'>Giá: </span>
            <span>{formatPrice(9000)}</span>
            {' - '}
            <span>{formatPrice(2000000)}</span>
          </label>
          <input
            className='input-range h-2 bg-slate-200 rounded-lg my-2'
            type='range'
            min='9000'
            max='4000000'
          />
        </div>
        <div className='flex items-center flex-wrap gap-2'>
          <div
            className='group flex items-center text-nowrap bg-primary text-[14px] font-semibold p-2 rounded-md cursor-pointer hover:bg-secondary hover:text-light common-transition'
            onClick={handleOpenMenu1}>
            Danh mục
            <FaCaretDown size={16} className='ml-1 text-dark group-hover:text-light common-transition' />
          </div>
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

          <div
            className='group flex items-center text-nowrap bg-primary text-[14px] font-semibold p-2 rounded-md cursor-pointer hover:bg-secondary hover:text-light common-transition'
            onClick={handleOpenMenu2}>
            Sắp xếp
            <FaCaretDown size={16} className='ml-1 text-dark group-hover:text-light common-transition' />
          </div>
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
      </div>
    </div>
  )
}

export default Meta
