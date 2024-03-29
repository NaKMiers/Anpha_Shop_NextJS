'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setCartItems } from '@/libs/reducers/cartReducer'
import { formatPrice } from '@/utils/formatNumber'
import axios from 'axios'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaHistory } from 'react-icons/fa'
import { FaBars, FaCartShopping, FaPhone, FaPlus, FaUser, FaUserSecret } from 'react-icons/fa6'
import { HiLightningBolt } from 'react-icons/hi'
import { IoChevronDown } from 'react-icons/io5'
import { TbLogout } from 'react-icons/tb'

interface HeaderProps {
  isStatic?: boolean
}

function Header({ isStatic }: HeaderProps) {
  // hook
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(state => state.cart.items)
  const cartLocalItems = useAppSelector(state => state.cart.localItems)
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [isShow, setIsShow] = useState(false)
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const lastScrollTop = useRef(0)
  const [cartLength, setCartlength] = useState(0)

  useEffect(() => {
    setCartlength(
      curUser
        ? cartItems.reduce((total, item) => total + item.quantity, 0)
        : cartLocalItems.reduce((total, item) => total + item.quantity, 0)
    )
  }, [cartItems, cartLocalItems, curUser])

  // get user's cart
  useEffect(() => {
    const getUserCart = async () => {
      if (curUser) {
        try {
          // send request to get user's cart
          const res = await axios.get('/api/cart')
          const { cart } = res.data

          // set cart to state
          dispatch(setCartItems(cart))

          console.log(cart)
        } catch (err: any) {
          console.log(err.message)
          toast.error(err.response.data.message)
        }
      }
    }
    getUserCart()
  }, [dispatch, curUser])

  // handle show and hide header on scroll
  useEffect(() => {
    const handleScroll = () => {
      let scrollTop = window.scrollY

      // scroll down
      if (scrollTop >= 21) {
        // scroll top
        if (scrollTop > lastScrollTop.current) {
          setIsShow(true)
        } else {
          setIsShow(false)
          setIsOpenMenu(false)
        }

        lastScrollTop.current = scrollTop
      } else {
        setIsShow(false)
        setIsOpenMenu(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  // open menu
  const handleOpenMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOpenMenu(!isOpenMenu)
  }

  // close menu
  const handleCloseMenu = () => {}

  return (
    <header
      className={`${
        isStatic ? 'static' : 'fixed z-50 left-0 top-0'
      } bg-dark-100 w-full text-light shadow-medium-light transition-all duration-300 ${
        isShow ? 'top-0' : 'top-[-100%]'
      }`}>
      {/* Main Header */}
      <div className='relative flex justify-between items-center max-w-1200 w-full h-[72px] m-auto px-21'>
        {/* Brand */}
        <div className='flex items-center '>
          <Link
            href='/'
            className='hidden sm:block shrink-0 rounded-full common-transition hover:shadow-medium-light'>
            <Image
              className='aspect-square rounded-full'
              src='/images/logo.jpg'
              width={40}
              height={40}
              alt='logo'
            />
          </Link>
          <Link href='/' className='text-2xl font-bold'>
            .AnphaShop
          </Link>
          <Link
            href='/user/recharge'
            className='ml-3 bg-primary px-3 py-[6px] rounded-extra-small flex items-center gap-1 group hover:bg-secondary common-transition'>
            <span className='font-bold font-body text-[18px] tracking-[0.02em] group-hover:text-white common-transition'>
              Nạp
            </span>
            <HiLightningBolt
              size={20}
              className='animate-bounce group-hover:text-white common-transition'
            />
          </Link>
        </div>

        {/* Nav for > sm */}
        <div className='hidden md:flex items-center gap-4'>
          <Link href='/buying-introduction' className='text-[18px] font-body tracking-wide text-nowrap'>
            Hướng dẫn mua hàng
          </Link>

          <Link href='/cart' className='relative'>
            <FaCartShopping size={24} className='common-transition hover:scale-110' />
            {!!cartLength && (
              <span className='absolute -top-2 right-[-5px] bg-primary rounded-full text-center px-[6px] py-[2px] text-[10px] font-bold'>
                {cartLength}
              </span>
            )}
          </Link>

          {curUser ? (
            <div className='group flex items-center gap-2 cursor-pointer' onClick={handleOpenMenu}>
              <Image
                className='aspect-square rounded-full'
                src={curUser?.avatar || process.env.DEFAULT_AVATAR!}
                width={40}
                height={40}
                alt='avatar'
              />
              <div className='text-[18px] font-body hover:underline underline-offset-2'>
                {formatPrice(curUser?.balance)}
              </div>
              <IoChevronDown size={22} className='common-transition hover:scale-125' />
            </div>
          ) : (
            <Link
              href='/auth/login'
              className='bg-secondary hover:bg-primary common-transition px-[10px] py-[6px] rounded-extra-small font-body font-semibold tracking-wider cursor-pointer'>
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

        {/* Menu */}
        <ul
          className={`${
            isOpenMenu ? 'max-w-full w-[300px] max-h-[350px] p-3' : 'max-h-0 p-0 max-w-0 w-0'
          } overflow-hidden transition-all duration-300 absolute top-[60px] right-21 z-30 rounded-medium shadow-sky-400 shadow-md bg-dark-100`}>
          <li className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-secondary common-transition'>
            <Image
              className='aspect-square rounded-full'
              src={curUser?.avatar || '/images/default-avatar.jpg'}
              height={40}
              width={40}
              alt='avatar'
            />
            <span className='font-semibold text-xl'>
              {curUser?.authType === 'local'
                ? curUser?.username
                : curUser?.firstname + ' ' + curUser?.lastname}
            </span>
          </li>

          <li className='flex items-center gap-1 py-2 px-3 rounded-lg hover:bg-secondary common-transition'>
            <span className='font-semibold'>Số dư: </span>
            <span>{formatPrice(curUser?.balance)}</span>
            <Link
              className='group flex-shrink-0 rounded-full ml-1 border-2 border-primary p-[2px] hover:scale-110 common-transition'
              href='/user/recharge'>
              <FaPlus size={14} className='text-primary common-transition' />
            </Link>
          </li>

          <li>
            <Link
              href='/user'
              className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-secondary common-transition'>
              <FaUser size={18} className='' />
              <span className='font-body tracking-wide text-[15px]'>Thông tin tài khoản</span>
            </Link>
          </li>
          <li>
            <Link
              href='/cart'
              className='flex items-center relative gap-2 py-2 px-3 rounded-lg hover:bg-secondary common-transition'>
              <FaCartShopping size={18} className='' />
              <span className='font-body tracking-wide text-[15px]'>Giỏ hàng</span>
              {!!cartLength && (
                <span className='absolute top-1/2 right-2 -translate-y-1/2 font-semibold rounded-full bg-primary min-w-5 flex items-center justify-center px-1 h-5 text-center text-xs'>
                  {cartLength}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              href='/order-history'
              className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-secondary common-transition'>
              <FaHistory size={18} className='' />
              <span className='font-body tracking-wide text-[15px]'>Lịch sử mua hàng</span>
            </Link>
          </li>
          <li>
            <Link
              href='/contact'
              className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-secondary common-transition'>
              <FaPhone size={18} className='' />
              <span className='font-body tracking-wide text-[15px]'>Liên hệ</span>
            </Link>
          </li>
          {curUser?.role !== 'user' && (
            <li>
              <Link
                href='/admin'
                className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-secondary common-transition'>
                <FaUserSecret size={18} />
                <span className='font-body tracking-wide text-[15px] text-primary'>
                  {curUser?.role.toUpperCase()}
                </span>
              </Link>
            </li>
          )}
          <li>
            <button
              className='flex items-center w-full gap-2 py-2 px-3 rounded-lg hover:bg-secondary common-transition'
              onClick={() => signOut()}>
              <TbLogout size={18} className='' />
              <span className='font-body tracking-wide text-[15px] text-yellow-500'>Đăng xuất</span>
            </button>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header
