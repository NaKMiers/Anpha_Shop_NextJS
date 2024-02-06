'use client'

import { formatPrice } from '@/utils/formatNumber'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

const user = {
  avatar: '/images/avatar.jpg',
  admin: true,
  fullname: 'Pi Pi',
}

function Header() {
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
      className={`fixed bg-dark-100 w-full text-light shadow-medium-light transition-all duration-300 ${
        isShow ? 'top-0' : 'top-[-100%]'
      }`}>
      {/* Main Header */}
      <div className='flex justify-between items-center max-w-1200 w-full h-[72px] m-auto px-21'>
        {/* Brand */}
        <div className='flex items-center '>
          <Link href='/' className='shrink-0 rounded-full common-transition hover:shadow-medium-light'>
            <Image src='/images/logo.jpg' width={40} height={40} alt='logo' />
          </Link>
          <Link href='/' className='text-2xl font-bold'>
            .AnphaShop
          </Link>
          <Link
            href='/user/recharge'
            className='ml-3 bg-primary px-3 py-[6px] rounded-extra-small flex items-center gap-[6px]'>
            <span className='font-bold font-body text-[18px] tracking-[0.02em]'>Nạp</span>
            <svg
              className='animate-bounce'
              xmlns='http://www.w3.org/2000/svg'
              height='1.2em'
              viewBox='0 0 448 512'>
              <path
                fill='#fff'
                d='M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z'
              />
            </svg>
          </Link>
        </div>

        {/* Nav for > sm */}
        <div className='hidden md:flex items-center gap-3'>
          <Link href='/huong-dan-mua-hang' className='text-[18px] font-body tracking-wide text-nowrap'>
            Hướng dẫn mua hàng
          </Link>

          <Link href='/cart' className='relative'>
            <svg xmlns='http://www.w3.org/2000/svg' height='22px' viewBox='0 0 576 512'>
              <path
                fill='#fff'
                d='M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z'
              />
            </svg>
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
              <svg xmlns='http://www.w3.org/2000/svg' height='18px' viewBox='0 0 512 512'>
                <path
                  fill='#fff'
                  d='M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z'
                />
              </svg>
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
            <svg xmlns='http://www.w3.org/2000/svg' height='22px' viewBox='0 0 448 512'>
              <path
                fill='#fff'
                d='M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z'
              />
            </svg>
          </button>
        </div>

        {/* Dropdown Menu */}
        <Menu className='mt-2' id='basic-menu' anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
          <div className='flex items-center gap-2 px-4  min-w-[250px] mt-1'>
            <Image src='/images/logo.jpg' width={40} height={40} alt='avatar' />
            <span className='font-semibold text-[22px] font-bod'>{user.fullname}</span>
          </div>

          <div className='flex items-center gap-1 px-4 mt-2 text-[16px]'>
            <span className='font-bold'>Số dư: </span>
            <div className='font-body font-semibold hover:underline underline-offset-2'>
              {formatPrice(2140980)}
            </div>
            <Link
              href='/user/recharge'
              className='rounded-full w-[18px] h-[18px] flex items-center justify-center border-dark p-[2px] border-2'>
              <svg xmlns='http://www.w3.org/2000/svg' height='14' viewBox='0 0 448 512'>
                <path
                  fill='#333'
                  d='M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z'
                />
              </svg>
            </Link>
          </div>

          <hr className='mt-2' />

          <MenuItem className='flex gap-2' onClick={handleCloseMenu}>
            <svg xmlns='http://www.w3.org/2000/svg' height='18' viewBox='0 0 448 512'>
              <path
                fill='#333'
                d='M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z'
              />
            </svg>
            <span className='font-body'>Thông tin tài khoản</span>
          </MenuItem>
          <MenuItem className='flex gap-2' onClick={handleCloseMenu}>
            <svg xmlns='http://www.w3.org/2000/svg' height='18' viewBox='0 0 576 512'>
              <path
                fill='#333'
                d='M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z'
              />
            </svg>
            <span className='font-body'>Giỏ hàng</span>
            <span className='ml-auto bg-primary rounded-full text-center px-2 py-[2px] text-[10px] font-bold'>
              6
            </span>
          </MenuItem>
          <MenuItem className='flex gap-2' onClick={handleCloseMenu}>
            <svg xmlns='http://www.w3.org/2000/svg' height='18' viewBox='0 0 512 512'>
              <path
                fill='#333'
                d='M75 75L41 41C25.9 25.9 0 36.6 0 57.9V168c0 13.3 10.7 24 24 24H134.1c21.4 0 32.1-25.9 17-41l-30.8-30.8C155 85.5 203 64 256 64c106 0 192 86 192 192s-86 192-192 192c-40.8 0-78.6-12.7-109.7-34.4c-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6C151.2 495 201.7 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C185.3 0 121.3 28.7 75 75zm181 53c-13.3 0-24 10.7-24 24V256c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65V152c0-13.3-10.7-24-24-24z'
              />
            </svg>
            <span className='font-body'>Lịch sử mua hàng</span>
          </MenuItem>
          <MenuItem className='flex gap-2' onClick={handleCloseMenu}>
            <svg xmlns='http://www.w3.org/2000/svg' height='18' viewBox='0 0 512 512'>
              <path
                fill='#333'
                d='M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z'
              />
            </svg>
            <span className='font-body'>Liên hệ</span>
          </MenuItem>
          {user.admin && (
            <MenuItem className='flex gap-2' onClick={handleCloseMenu}>
              <svg xmlns='http://www.w3.org/2000/svg' height='18' viewBox='0 0 448 512'>
                <path
                  fill='#333'
                  d='M224 16c-6.7 0-10.8-2.8-15.5-6.1C201.9 5.4 194 0 176 0c-30.5 0-52 43.7-66 89.4C62.7 98.1 32 112.2 32 128c0 14.3 25 27.1 64.6 35.9c-.4 4-.6 8-.6 12.1c0 17 3.3 33.2 9.3 48H45.4C38 224 32 230 32 237.4c0 1.7 .3 3.4 1 5l38.8 96.9C28.2 371.8 0 423.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7c0-58.5-28.2-110.4-71.7-143L415 242.4c.6-1.6 1-3.3 1-5c0-7.4-6-13.4-13.4-13.4H342.7c6-14.8 9.3-31 9.3-48c0-4.1-.2-8.1-.6-12.1C391 155.1 416 142.3 416 128c0-15.8-30.7-29.9-78-38.6C324 43.7 302.5 0 272 0c-18 0-25.9 5.4-32.5 9.9c-4.8 3.3-8.8 6.1-15.5 6.1zm56 208H267.6c-16.5 0-31.1-10.6-36.3-26.2c-2.3-7-12.2-7-14.5 0c-5.2 15.6-19.9 26.2-36.3 26.2H168c-22.1 0-40-17.9-40-40V169.6c28.2 4.1 61 6.4 96 6.4s67.8-2.3 96-6.4V184c0 22.1-17.9 40-40 40zm-88 96l16 32L176 480 128 288l64 32zm128-32L272 480 240 352l16-32 64-32z'
                />
              </svg>
              <span className='font-body'>Admin</span>
            </MenuItem>
          )}
          <MenuItem className='flex gap-2' onClick={handleCloseMenu}>
            <svg xmlns='http://www.w3.org/2000/svg' height='18' viewBox='0 0 512 512'>
              <path
                fill='#333'
                d='M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z'
              />
            </svg>
            <span className='font-body text-yellow-400'>Đăng xuất</span>
          </MenuItem>
        </Menu>
      </div>
    </header>
  )
}

export default Header
