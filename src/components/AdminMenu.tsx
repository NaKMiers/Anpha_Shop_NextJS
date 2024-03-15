'use client'

import { adminLinks } from '@/constansts'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FaBarsStaggered } from 'react-icons/fa6'

function AdminMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`fixed top-[20%] z-20 right-0 p-4 bg-dark-100 text-light rounded-tl-medium rounded-bl-medium shadow-primary shadow-md max-w-[300px] w-full common-transition ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}>
      <button
        className='absolute top-[14px] left-0 -translate-x-full p-[5px] pl-2 bg-dark-100 rounded-tl-md rounded-bl-md shadow-md common-transition hover:bg-primary'
        onClick={() => setOpen(!open)}>
        <FaBarsStaggered size={20} className='' />
      </button>

      <div className='flex items-center gap-2 mb-3'>
        <Image
          className='rounded-full shadow-md'
          src='/images/logo.jpg'
          height={40}
          width={40}
          alt='avatar'
        />
        <span className='font-semibold font-body tracking-wide text-xl'>Nguyen Pi Pi</span>
      </div>

      <ul>
        {adminLinks.map((item: any) => (
          <li className='flex items-center gap-2' key={item.title}>
            <Link
              className='flex flex-grow items-center gap-2 group rounded-lg p-2 common-transition hover:bg-secondary font-body tracking-wide'
              href={item.links[0].href}>
              <item.icon size={18} className='' />
              {item.links[0].title}
            </Link>
            {item.links[1] && (
              <Link
                className='group flex-shrink-0 rounded-full border-2 border-white p-[2px] hover:scale-110 common-transition hover:border-primary'
                href={item.links[1].href}>
                <FaPlus size={12} className='group-hover:text-primary common-transition' />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminMenu
