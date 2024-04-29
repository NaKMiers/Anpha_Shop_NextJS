'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { FaBars, FaCartShopping } from 'react-icons/fa6'
import { HiLightningBolt } from 'react-icons/hi'
import { IoChevronDown } from 'react-icons/io5'

interface HeaderProps {
  isStatic?: boolean
  className?: string
}

function Header({ isStatic, className }: HeaderProps) {
  const { data: session } = useSession()
  const curUser: any = session?.user

  return (
    <header
      className={`${
        isStatic ? 'static' : 'fixed z-50 left-0 top-0'
      } bg-dark-100 w-full text-white shadow-medium-light transition-all duration-300 top-0 ${className}`}>
      {/* Main Header */}
      <div className='relative flex justify-between items-center max-w-1200 w-full h-[72px] m-auto px-21'>
        {/* MARK: Brand */}
        <div className='pl-4 -ml-4 flex items-center max-w-[300px] w-[90%] h-full overflow-x-scroll no-scrollbar'>
          <Link
            href='/'
            prefetch={false}
            className='hidden sm:block shrink-0 rounded-full common-transition spin'>
            <Image
              className='aspect-square rounded-full'
              src='/images/logo.jpg'
              width={40}
              height={40}
              alt='logo'
            />
          </Link>
          <Link href='/' prefetch={false} className='text-2xl font-bold'>
            .AnphaShop
          </Link>
          <Link
            href='/recharge'
            className='flex ml-3 bg-primary px-[10px] py-[6px] rounded-lg items-center gap-1 group hover:bg-secondary common-transition'>
            <span className='font-bold font-body text-[18px] tracking-[0.02em] group-hover:text-white common-transition'>
              Nạp
            </span>
            <HiLightningBolt
              size={20}
              className='animate-bounce group-hover:text-white common-transition'
            />
          </Link>
        </div>

        {/* MARK: Nav */}
        <div className='hidden md:flex items-center gap-4'>
          <Link href='/cart' prefetch={false}>
            <FaCartShopping size={24} />
          </Link>

          {curUser ? (
            !!curUser._id && (
              <div className='flex items-center gap-2 cursor-pointer'>
                <div className='w-10 h-10 rounded-full loading' />
                <div className='loading w-20 h-7 rounded-lg' />
                <IoChevronDown size={22} />
              </div>
            )
          ) : (
            <Link
              href='/auth/login'
              className='bg-secondary hover:bg-primary text-nowrap common-transition px-[10px] py-[6px] rounded-extra-small font-body font-semibold tracking-wider cursor-pointer'>
              Đăng nhập
            </Link>
          )}
        </div>

        {/* Menu Button */}
        <div className='md:hidden flex items-center'>
          <button className='flex justify-center items-center w-[40px] h-[40px]'>
            <FaBars size={22} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
