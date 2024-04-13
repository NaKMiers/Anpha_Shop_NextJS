'use client'

import { ICategory } from '@/models/CategoryModel'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

interface SidebarProps {
  categories: ICategory[]
  className?: string
}

function Sidebar({ categories, className = '' }: SidebarProps) {
  const [show, setShow] = useState<boolean>(true)
  const timeOutRef = useRef<any>(null)

  console.log(show)

  // handle show and hide header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShow(false)
      if (timeOutRef.current) {
        clearTimeout(timeOutRef.current)
      }

      timeOutRef.current = setTimeout(() => {
        setShow(true)
      }, 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      className={`flex flex-col items-center py-3 gap-3 fixed z-40 top-1/2 -translate-y-1/2 bg-dark-100 rounded-lg shadow-medium-light transition-all duration-300 ${
        show ? 'right-3 opacity-1' : 'right-0 translate-x-full opacity-0'
      }  ${className}`}>
      <Link href='/' className='border-b pb-3'>
        <Image
          className='aspect-square rounded-full wiggle-0'
          src='/images/default-avatar.jpg'
          width={36}
          height={36}
          alt='logo'
        />
      </Link>

      <Link href='/' className='rounded-full group'>
        <span className='text-[24px] font-semibold text-orange-500 italic wiggle block leading-5'>
          1st
        </span>
      </Link>

      <div className='flex flex-col px-3 gap-3 max-h-[230px] overflow-y-scroll no-scrollbar'>
        {categories.map(category => (
          <Link
            href={`/${category.slug}`}
            className='rounded-full group'
            title={category.title}
            key={category.slug}>
            <Image
              className='aspect-square wiggle'
              src={`/images/${category?.slug}-icon.jpg`}
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

export default Sidebar
