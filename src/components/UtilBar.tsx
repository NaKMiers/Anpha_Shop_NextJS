'use client'

import { ICategory } from '@/models/CategoryModel'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { FaGripVertical } from 'react-icons/fa'

interface UtilBarProps {
  categories: ICategory[]
  className?: string
}

function UtilBar({ categories, className = '' }: UtilBarProps) {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [show, setShow] = useState<boolean>(false)
  const [width, setWidth] = useState<number>(0)

  // refs
  const timeOutRef = useRef<any>(null)

  // handle show and hide header on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (width >= 768) return

      setShow(false)
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current)
      }

      timeOutRef.current = setTimeout(() => {
        // scroll to end of page then not show
        if (window.scrollY + window.innerHeight >= document.body.clientHeight) {
          setShow(false)
          return
        }

        setShow(true)
      }, 350)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [width])

  // handle resize
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div
      className={`flex md:flex-col justify-center items-center gap-5 pl-3 w-[calc(100%-21px)] md:w-auto md:px-0 md:py-3 fixed z-40 left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 md:top-1/2 md:-translate-y-1/2 bg-dark-100 rounded-lg shadow-medium-light transition-all duration-300 ${
        show
          ? 'bottom-21/2 md:bottom-auto md:right-3 opacity-1'
          : 'bottom-0 md:bottom-auto translate-y-full md:translate-y-auto md:right-0 md:translate-x-[100%] opacity-0 md:opacity-100'
      }  ${className}`}
    >
      <button
        className='group hidden md:flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-0 -translate-x-full py-3 bg-white rounded-l-md shadow-md'
        onClick={() => setShow(prev => !prev)}
      >
        <FaGripVertical size={20} className={`wiggle`} />
      </button>

      {/* MARK: Avatar */}
      {curUser?._id && (
        <Link href='/user' className='md:border-b md:pb-3 py-3 md:py-0 flex-shrink-0'>
          <Image
            className='aspect-square rounded-full wiggle-0'
            src={curUser.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
            width={36}
            height={36}
            alt='logo'
          />
        </Link>
      )}

      {/* MARK: Best Seller */}
      <Link href='/#best-seller' className='rounded-full group py-3 md:py-0'>
        <span className='text-[24px] font-semibold text-orange-500 italic wiggle block leading-5'>
          1st
        </span>
      </Link>

      {/* MARK: Categories */}
      <div className='flex md:flex-col px-3 py-3 -ml-3 md:m-0 md:-mt-3 md:max-h-[282px] items-center gap-5 overflow-auto no-scrollbar'>
        {categories.map(category => (
          <Link
            href={`/#${category.slug}`}
            className='flex-shrink-0 group'
            title={category.title}
            key={category.slug}
          >
            <Image
              className='aspect-square wiggle rounded-md'
              src={`${category.logo}`}
              width={28}
              height={28}
              alt='logo'
            />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default UtilBar
