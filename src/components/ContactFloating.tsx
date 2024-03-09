'use client'
import { redPathnameList } from '@/constansts'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FaChevronUp } from 'react-icons/fa6'

function ContactFloating() {
  const pathname = usePathname()
  const [isShow, setIsShow] = useState(false)

  if (redPathnameList.some(path => pathname.startsWith(path))) {
    return null
  }

  return (
    <div
      className={`fixed right-12 bottom-9 bg-white flex flex-col justify-center items-center rounded-xl transition-all duration-300 overflow-hidden shadow-lg ${
        !isShow ? 'translate-y-full' : ''
      }`}>
      <button
        className='group px-2 py-2 flex justify-center items-center w-full'
        onClick={() => setIsShow(!isShow)}>
        <FaChevronUp
          size={20}
          className={`group-hover:scale-125 ${isShow ? 'rotate-180' : ''} common-transition text-dark`}
        />
      </button>

      <a
        href='https://zalo.me/0899320427'
        target='_blank'
        rel='noreferrer'
        className='p-2 hover:scale-110 common-transition hover:shadow-medium-light'>
        <Image src='/images/zalo.jpg' width={36} height={36} alt='zalo' />
      </a>
      <a
        href='https://www.messenger.com/t/170660996137385'
        target='_blank'
        rel='noreferrer'
        className='p-2 hover:scale-110 common-transition hover:shadow-medium-light rounded-full'>
        <Image src='/images/messenger.jpg' width={36} height={36} alt='zalo' />
      </a>
      <a
        href='https://www.instagram.com/anpha.shop'
        target='_blank'
        rel='noreferrer'
        className='p-2 hover:scale-110 common-transition hover:shadow-medium-light'>
        <Image src='/images/instagram.jpg' width={36} height={36} alt='zalo' />
      </a>
    </div>
  )
}

export default ContactFloating
