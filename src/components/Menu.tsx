'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { ICategory } from '@/models/CategoryModel'
import { getForceAllCagetoriesApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaHistory, FaPhone, FaPlus, FaUser, FaUserPlus, FaUserSecret } from 'react-icons/fa'
import { FaCartShopping } from 'react-icons/fa6'
import { FiLogIn } from 'react-icons/fi'
import { TbLogout } from 'react-icons/tb'

interface MenuProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

function Menu({ open, setOpen, className = '' }: MenuProps) {
  // hooks
  const cartItems = useAppSelector(state => state.cart.items)
  const cartLocalItems = useAppSelector(state => state.cart.localItems)
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [cartLength, setCartlength] = useState<number>(0)
  const [categories, setCategories] = useState<ICategory[]>([])

  // get cart length
  useEffect(() => {
    setCartlength(
      curUser
        ? cartItems.reduce((total, item) => total + item.quantity, 0)
        : cartLocalItems.reduce((total, item) => total + item.quantity, 0)
    )
  }, [cartItems, cartLocalItems, curUser])

  // get categories
  useEffect(() => {
    const getCategories = async () => {
      const { categories } = await getForceAllCagetoriesApi('?exist-product=true')

      setCategories(
        categories.sort((a: ICategory, b: ICategory) => b.productQuantity - a.productQuantity)
      )
    }
    getCategories()
  }, [])

  // key board event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // clean up
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setOpen])

  return (
    <>
      {/* Overlay */}
      <div
        className={`${
          open ? 'block' : 'hidden'
        } fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-30 ${className}`}
        onClick={() => setOpen(false)}
      />

      {/* Menu */}
      <ul
        className={`${
          open
            ? 'max-h-screen sm:max-w-full sm:w-[300px] sm:max-h-[350px] p-3 opacity-1x'
            : 'max-h-0 sm:max-h-0 p-0 sm:max-w-0 sm:w-0 opacity-0x'
        } ${
          curUser && !curUser?._id ? 'hidden' : ''
        } w-full h-[calc(100vh_-_72px)] sm:h-auto overflow-hidden transition-all duration-300 absolute top-[72px] sm:top-[60px] right-0 sm:right-21 z-30 sm:rounded-medium sm:shadow-sky-400 shadow-md bg-dark-100`}>
        {curUser ? (
          curUser?._id && (
            <>
              <li className='flex items-center gap-2 py-2 px-3 rounded-lg group hover:bg-secondary common-transition'>
                <Image
                  className='aspect-square rounded-full wiggle-0'
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
                  href='/recharge'
                  onClick={() => setOpen(false)}>
                  <FaPlus size={11} className='text-primary common-transition' />
                </Link>
              </li>

              <li className='group' onClick={() => setOpen(false)}>
                <Link
                  href='/user'
                  className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-secondary common-transition'>
                  <FaUser size={18} className='wiggle w-[22px]' />
                  <span className='font-body tracking-wide text-[15px]'>Thông tin tài khoản</span>
                </Link>
              </li>
              <li className='group' onClick={() => setOpen(false)}>
                <Link
                  href='/cart'
                  className='flex items-center relative gap-2 py-2 px-3 rounded-lg hover:bg-secondary common-transition'>
                  <FaCartShopping size={18} className='wiggle w-[22px]' />
                  <span className='font-body tracking-wide text-[15px]'>Giỏ hàng</span>
                  {!!cartLength && (
                    <span className='absolute top-1/2 right-2 -translate-y-1/2 font-semibold rounded-full bg-primary min-w-5 flex items-center justify-center px-1 h-5 text-center text-xs'>
                      {cartLength}
                    </span>
                  )}
                </Link>
              </li>
              <li className='group' onClick={() => setOpen(false)}>
                <Link
                  href='/user/order-history'
                  className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-secondary common-transition'>
                  <FaHistory size={18} className='wiggle w-[22px]' />
                  <span className='font-body tracking-wide text-[15px]'>Lịch sử mua hàng</span>
                </Link>
              </li>
              <li className='group' onClick={() => setOpen(false)}>
                <a
                  href='https://www.messenger.com/t/170660996137305'
                  className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-secondary common-transition'>
                  <FaPhone size={18} className='wiggle w-[22px]' />
                  <span className='font-body tracking-wide text-[15px]'>Liên hệ</span>
                </a>
              </li>
              {curUser?.role !== 'user' && (
                <li className='group' onClick={() => setOpen(false)}>
                  <Link
                    href='/admin'
                    className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-secondary common-transition'>
                    <FaUserSecret size={18} className='wiggle w-[22px]' />
                    <span className='font-body tracking-wide text-[15px] text-primary'>
                      {curUser?.role.charAt(0).toUpperCase() + curUser?.role.slice(1)}
                    </span>
                  </Link>
                </li>
              )}
              <li className='group' onClick={() => setOpen(false)}>
                <button
                  className='flex items-center w-full gap-2 py-2 px-3 rounded-lg hover:bg-secondary common-transition'
                  onClick={() => signOut()}>
                  <TbLogout size={20} className='wiggle w-[22px]' />
                  <span className='font-body tracking-wide text-[15px] text-yellow-500'>Đăng xuất</span>
                </button>
              </li>
            </>
          )
        ) : (
          <>
            <li className='group' onClick={() => setOpen(false)}>
              <Link
                href='/cart'
                className='flex items-center relative gap-2 py-2 px-3 rounded-lg hover:bg-secondary common-transition'>
                <FaCartShopping size={18} className='wiggle w-[22px]' />
                <span className='font-body tracking-wide text-[15px]'>Giỏ hàng</span>
                {!!cartLength && (
                  <span className='absolute top-1/2 right-2 -translate-y-1/2 font-semibold rounded-full bg-primary min-w-5 flex items-center justify-center px-1 h-5 text-center text-xs'>
                    {cartLength}
                  </span>
                )}
              </Link>
            </li>
            <li className='group' onClick={() => setOpen(false)}>
              <Link
                href='/auth/login'
                className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-secondary common-transition'>
                <FiLogIn size={18} className='wiggle w-[22px]' />
                <span className='font-body tracking-wide text-[15px] text-yellow-500'>Đăng nhập</span>
              </Link>
            </li>
            <li className='group' onClick={() => setOpen(false)}>
              <Link
                href='/auth/register'
                className='flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-secondary common-transition'>
                <FaUserPlus size={18} className='wiggle w-[22px]' />
                <span className='font-body tracking-wide text-[15px] text-yellow-500'>Đăng ký</span>
              </Link>
            </li>
          </>
        )}

        <div className='sm:hidden mt-5 flex justify-center flex-wrap w-full max-h-[calc(42px_*_3)] px-7 overflow-y-auto overflow-x-hidden'>
          {categories.map(category => (
            <Link
              href={`/category?ctg=${category.slug}`}
              className='flex-shrink-0 group rounded-lg overflow-hidden p-2'
              key={category.slug}>
              <Image
                className='wiggle'
                src={`/images/${category.slug}-icon.jpg`}
                height={25}
                width={25}
                alt={category.slug}
              />
            </Link>
          ))}
        </div>
      </ul>
    </>
  )
}

export default Menu
