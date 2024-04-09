'use client'

import { adminLinks } from '@/constansts'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FaBarsStaggered } from 'react-icons/fa6'

function AdminMenu() {
  const [open, setOpen] = useState(false)

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
  }, [])

  return (
    <>
      <div
        className={`${
          open ? 'block' : 'hidden'
        } fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-30`}
        onClick={() => setOpen(false)}
      />
      <button
        className={`fixed top-[20%] z-20 right-0 p-[5px] pl-2 bg-dark-100 text-white rounded-tl-md rounded-bl-md shadow-md common-transition hover:bg-primary ${
          !open ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={() => setOpen(!open)}>
        <FaBarsStaggered size={20} />
      </button>
      <div
        className={`fixed top-[20%] z-${
          open ? 30 : 20
        } right-0 p-4 bg-dark-100 text-light rounded-tl-medium rounded-bl-medium shadow-primary shadow-md max-w-[300px] w-full common-transition ${
          open ? 'translate-x-0 opacity-1' : 'translate-x-full opacity-10'
        }`}>
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
    </>
  )
}

export default AdminMenu
