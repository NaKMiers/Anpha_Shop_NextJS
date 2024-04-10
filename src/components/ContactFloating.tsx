'use client'
import Image from 'next/image'
import { useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { FaChevronUp } from 'react-icons/fa6'

function ContactFloating() {
  const [isShow, setIsShow] = useState(false)

  return (
    <div
      className={`fixed z-30 right-10 bottom-9 bg-white flex justify-center items-center rounded-xl transition-all duration-300 overflow-hidden shadow-lg select-none ${
        !isShow ? 'translate-x-full' : ''
      }`}>
      <button className='group p-2' onClick={() => setIsShow(!isShow)}>
        <FaChevronLeft
          size={20}
          className={`group-hover:scale-125 ${isShow ? 'rotate-180' : ''} common-transition text-dark`}
        />
      </button>

      <a
        href='https://zalo.me/0899320427'
        target='_blank'
        rel='noreferrer'
        className='p-2 hover:scale-110 common-transition hover:shadow-medium-light'>
        <Image src='/images/zalo.jpg' width={32} height={32} alt='zalo' />
      </a>
      <a
        href='https://www.messenger.com/t/170660996137385'
        target='_blank'
        rel='noreferrer'
        className='p-2 hover:scale-110 common-transition hover:shadow-medium-light rounded-full'>
        <Image src='/images/messenger.jpg' width={32} height={32} alt='zalo' />
      </a>
      <a
        href='mailto:anpha.pohs@gmail.com'
        target='_blank'
        rel='noreferrer'
        className='p-2 hover:scale-110 common-transition hover:shadow-medium-light rounded-full'>
        <Image src='/images/gmail.jpg' width={32} height={32} alt='gmail' />
      </a>
    </div>
  )
}

export default ContactFloating
