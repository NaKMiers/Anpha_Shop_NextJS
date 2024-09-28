'use client'

import { useAppSelector } from '@/libs/hooks'
import { formatPrice } from '@/utils/number'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { memo, useEffect, useState } from 'react'
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

  // get cart length
  useEffect(() => {
    setCartlength(
      curUser
        ? cartItems.reduce((total, item) => total + item.quantity, 0)
        : cartLocalItems.reduce((total, item) => total + item.quantity, 0)
    )
  }, [cartItems, cartLocalItems, curUser])

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
      {/* MARK: Overlay */}
      <div
        className={`${
          open ? 'block' : 'hidden'
        } fixed bottom-0 left-0 right-0 top-0 z-30 h-screen w-screen ${className}`}
        onClick={() => setOpen(false)}
      />

      {/* MARK: Main */}
      <ul
        className={`${
          open
            ? 'opacity-1x max-h-screen p-3 sm:max-h-[350px] sm:w-[300px] sm:max-w-full'
            : 'opacity-0x max-h-0 p-0 sm:max-h-0 sm:w-0 sm:max-w-0'
        } ${
          curUser && !curUser?._id ? 'hidden' : ''
        } absolute right-0 top-[72px] z-30 h-[calc(100vh_-_72px)] w-full overflow-hidden bg-dark-100 shadow-md transition-all duration-300 sm:right-21 sm:top-[60px] sm:h-auto sm:rounded-medium sm:shadow-sky-400`}
      >
        {curUser ? (
          // MARK: User Logged In
          curUser?._id && (
            <>
              <Link
                href="/user"
                className="common-transition group flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-secondary"
              >
                <Image
                  className="wiggle-0 aspect-square rounded-full"
                  src={curUser?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
                  height={40}
                  width={40}
                  alt="avatar"
                />
                <span className="text-xl font-semibold">
                  {curUser?.authType === 'local'
                    ? curUser?.username
                    : curUser?.firstname + ' ' + curUser?.lastname}
                </span>
              </Link>

              <li className="common-transition flex items-center gap-1 rounded-lg px-3 py-2 hover:bg-secondary">
                <span className="font-semibold">Số dư: </span>
                <span>{formatPrice(curUser?.balance)}</span>
                <Link
                  className="common-transition group ml-1 flex-shrink-0 rounded-full border-2 border-primary p-[2px] hover:scale-110"
                  href="/recharge"
                  onClick={() => setOpen(false)}
                >
                  <FaPlus
                    size={11}
                    className="common-transition text-primary"
                  />
                </Link>
              </li>

              <li
                className="group"
                onClick={() => setOpen(false)}
              >
                <Link
                  href="/user"
                  className="common-transition flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-secondary"
                >
                  <FaUser
                    size={18}
                    className="wiggle w-[22px]"
                  />
                  <span className="font-body text-[15px] tracking-wide">Thông tin tài khoản</span>
                </Link>
              </li>
              <li
                className="group"
                onClick={() => setOpen(false)}
              >
                <Link
                  href="/cart"
                  prefetch={false}
                  className="common-transition relative flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-secondary"
                >
                  <FaCartShopping
                    size={18}
                    className="wiggle w-[22px]"
                  />
                  <span className="font-body text-[15px] tracking-wide">Giỏ hàng</span>
                  {!!cartLength && (
                    <span className="absolute right-2 top-1/2 flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-full bg-primary px-1 text-center text-xs font-semibold">
                      {cartLength}
                    </span>
                  )}
                </Link>
              </li>
              <li
                className="group"
                onClick={() => setOpen(false)}
              >
                <Link
                  href="/user/order-history"
                  className="common-transition flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-secondary"
                >
                  <FaHistory
                    size={18}
                    className="wiggle w-[22px]"
                  />
                  <span className="font-body text-[15px] tracking-wide">Lịch sử mua hàng</span>
                </Link>
              </li>
              <li
                className="group"
                onClick={() => setOpen(false)}
              >
                <a
                  href="https://www.messenger.com/t/170660996137305"
                  className="common-transition flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-secondary"
                >
                  <FaPhone
                    size={18}
                    className="wiggle w-[22px]"
                  />
                  <span className="font-body text-[15px] tracking-wide">Liên hệ</span>
                </a>
              </li>
              {curUser?.role !== 'user' && (
                <li
                  className="group"
                  onClick={() => setOpen(false)}
                >
                  <Link
                    href={
                      ['admin', 'editor'].includes(curUser?.role)
                        ? '/admin/order/all'
                        : '/admin/summary/all'
                    }
                    className="common-transition flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-secondary"
                  >
                    <FaUserSecret
                      size={18}
                      className="wiggle w-[22px]"
                    />
                    <span className="font-body text-[15px] tracking-wide text-primary">
                      {/* {curUser?.role.charAt(0).toUpperCase() + curUser?.role.slice(1)} */}
                      {['admin', 'editor'].includes(curUser?.role) ? 'Orders' : 'Collaborator'}
                    </span>
                  </Link>
                </li>
              )}
              <li
                className="group"
                onClick={() => setOpen(false)}
              >
                <button
                  className="common-transition flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-secondary"
                  onClick={() => signOut()}
                >
                  <TbLogout
                    size={20}
                    className="wiggle w-[22px]"
                  />
                  <span className="font-body text-[15px] tracking-wide text-yellow-500">Đăng xuất</span>
                </button>
              </li>
            </>
          )
        ) : (
          // MARK: User Not Logged In
          <>
            <li
              className="group"
              onClick={() => setOpen(false)}
            >
              <Link
                href="/cart"
                className="common-transition relative flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-secondary"
              >
                <FaCartShopping
                  size={18}
                  className="wiggle w-[22px]"
                />
                <span className="font-body text-[15px] tracking-wide">Giỏ hàng</span>
                {!!cartLength && (
                  <span className="absolute right-2 top-1/2 flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-full bg-primary px-1 text-center text-xs font-semibold">
                    {cartLength}
                  </span>
                )}
              </Link>
            </li>
            <li
              className="group"
              onClick={() => setOpen(false)}
            >
              <a
                href="https://www.messenger.com/t/170660996137305"
                className="common-transition flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-secondary"
              >
                <FaPhone
                  size={18}
                  className="wiggle w-[22px]"
                />
                <span className="font-body text-[15px] tracking-wide">Liên hệ</span>
              </a>
            </li>
            <li
              className="group"
              onClick={() => setOpen(false)}
            >
              <Link
                href="/auth/login"
                className="common-transition flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-secondary"
              >
                <FiLogIn
                  size={18}
                  className="wiggle w-[22px]"
                />
                <span className="font-body text-[15px] tracking-wide text-yellow-500">Đăng nhập</span>
              </Link>
            </li>
            <li
              className="group"
              onClick={() => setOpen(false)}
            >
              <Link
                href="/auth/register"
                className="common-transition flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-secondary"
              >
                <FaUserPlus
                  size={18}
                  className="wiggle w-[22px]"
                />
                <span className="font-body text-[15px] tracking-wide text-yellow-500">Đăng ký</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </>
  )
}

export default memo(Menu)
