'use client'

import { formatPrice } from '@/utils/formatNumber'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FaBars, FaCartShopping, FaPhone, FaPlus, FaUser, FaUserSecret } from 'react-icons/fa6'
import { IoChevronDown } from 'react-icons/io5'
import { BsFillLightningChargeFill } from 'react-icons/bs'
import { HiLightningBolt } from 'react-icons/hi'
import { FaHistory, FaShoppingBag, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa'

interface HeaderProps {
  isStatic?: boolean
}

const user = {
  avatar: '/images/avatar.jpg',
  admin: true,
  fullname: 'Pi Pi',
}

function Header({ isStatic }: HeaderProps) {
  const [isShow, setIsShow] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const lastScrollTop = useRef(0)

  // handle show and hide header on scroll
  useEffect(() => {
    const handleScroll = () => {
      let scrollTop = window.scrollY

      if (scrollTop >= 21) {
        scrollTop > lastScrollTop.current ? setIsShow(true) : setIsShow(false)
        lastScrollTop.current = scrollTop
      } else {
        setIsShow(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  // open menu
  const handleOpenMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }
  // close menu
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  return (
    <header
      className={`${
        isStatic ? 'static' : 'fixed z-50 left-0 top-0'
      } bg-dark-100 w-full text-light shadow-medium-light transition-all duration-300 ${
        isShow ? 'top-0' : 'top-[-100%]'
      }`}>
      {/* Main Header */}
      <div className='flex justify-between items-center max-w-1200 w-full h-[72px] m-auto px-21'>
        {/* Brand */}
        <div className='flex items-center '>
          <Link
            href='/'
            className='hidden sm:block shrink-0 rounded-full common-transition hover:shadow-medium-light'>
            <Image src='/images/logo.jpg' width={40} height={40} alt='logo' />
          </Link>
          <Link href='/' className='text-2xl font-bold'>
            .AnphaShop
          </Link>
          <Link
            href='/user/recharge'
            className='ml-3 bg-primary px-3 py-[6px] rounded-extra-small flex items-center gap-1'>
            <span className='font-bold font-body text-[18px] tracking-[0.02em]'>Nạp</span>
            <HiLightningBolt size={20} className='animate-bounce' />
          </Link>
        </div>

        {/* Nav for > sm */}
        <div className='hidden md:flex items-center gap-3'>
          <Link href='/huong-dan-mua-hang' className='text-[18px] font-body tracking-wide text-nowrap'>
            Hướng dẫn mua hàng
          </Link>

          <Link href='/cart' className='relative'>
            <FaCartShopping size={24} className='common-transition hover:scale-110' />
            <span className='absolute -top-2 right-[-5px] bg-primary rounded-full text-center px-[6px] py-[2px] text-[10px] font-bold'>
              6
            </span>
          </Link>

          {user ? (
            <div className='group flex items-center gap-2 cursor-pointer' onClick={handleOpenMenu}>
              <Image src='/images/logo.jpg' width={40} height={40} alt='avatar' />
              <div className='text-[18px] font-body hover:underline underline-offset-2'>
                {formatPrice(2140980)}
              </div>
              <IoChevronDown size={22} className='common-transition hover:scale-125' />
            </div>
          ) : (
            <Link
              href='/auth/login'
              className='bg-secondary px-[10px] py-[6px] rounded-extra-small font-body font-semibold tracking-wider'>
              Đăng nhập
            </Link>
          )}
        </div>

        {/* Nav for sm */}
        <div className='md:hidden flex items-center' onClick={handleOpenMenu}>
          <button className='flex justify-center items-center w-[40px] h-[40px]'>
            <FaBars size={22} className='common-transition hover:scale-110' />
          </button>
        </div>

        {/* Dropdown Menu */}
        <Menu className='mt-2' id='basic-menu' anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
          <Link href='/' className='flex items-center gap-2 px-4  min-w-[250px] mt-1'>
            <Image
              className='hover:shadow-md common-transition rounded-full'
              src='/images/logo.jpg'
              width={40}
              height={40}
              alt='avatar'
            />
            <span className='font-semibold text-[22px] font-bod'>{user.fullname}</span>
          </Link>

          <div className='flex items-center gap-1 px-4 mt-2 text-[16px]'>
            <span className='font-bold'>Số dư: </span>
            <div className='font-body font-semibold hover:underline underline-offset-2'>
              {formatPrice(2140980)}
            </div>
            <Link
              href='/user/recharge'
              className='group rounded-full w-[18px] h-[18px] flex items-center justify-center border-dark p-[2px] border-2'>
              <FaPlus size={16} className='group-hover:scale-110 common-transition' />
            </Link>
          </div>

          <hr className='mt-2' />

          <MenuItem className='group flex gap-2' onClick={handleCloseMenu}>
            <FaUser size={18} className='group-hover:scale-110 common-transition' />
            <span className='font-body'>Thông tin tài khoản</span>
          </MenuItem>
          <MenuItem className='group flex gap-2' onClick={handleCloseMenu}>
            <FaShoppingCart size={18} className='group-hover:scale-110 common-transition' />
            <span className='font-body'>Giỏ hàng</span>
            <span className='ml-auto bg-primary rounded-full text-center px-2 py-[2px] text-[10px] font-bold'>
              6
            </span>
          </MenuItem>
          <MenuItem className='group flex gap-2' onClick={handleCloseMenu}>
            <FaHistory size={18} className='group-hover:scale-110 common-transition' />
            <span className='font-body'>Lịch sử mua hàng</span>
          </MenuItem>
          <MenuItem className='group flex gap-2' onClick={handleCloseMenu}>
            <FaPhone size={18} className='group-hover:scale-110 common-transition' />
            <span className='font-body'>Liên hệ</span>
          </MenuItem>
          {user.admin && (
            <MenuItem className='group flex gap-2' onClick={handleCloseMenu}>
              <FaUserSecret size={18} className='group-hover:scale-110 common-transition' />
              <span className='font-body'>Admin</span>
            </MenuItem>
          )}
          <MenuItem className='group flex gap-2' onClick={handleCloseMenu}>
            <FaSignOutAlt size={18} className='group-hover:scale-110 common-transition' />

            <span className='font-body text-yellow-400'>Đăng xuất</span>
          </MenuItem>
        </Menu>
      </div>
    </header>
  )
}

export default Header
