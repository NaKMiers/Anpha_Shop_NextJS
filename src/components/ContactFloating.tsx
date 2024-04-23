'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'

interface ContactFloatingProps {
  className?: string
}

function ContactFloating({ className = '' }: ContactFloatingProps) {
  // states
  const [open, setOpen] = useState<boolean>(false)

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
      <div
        className={`${
          open ? 'block' : 'hidden'
        } fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-30 ${className}`}
        onClick={() => setOpen(false)}
      />
      <div
        className={`fixed z-30 right-3 bottom-9 bg-dark-100 flex items-center rounded-xl transition-all duration-300 overflow-hidden shadow-medium-light select-none ${
          !open ? '' : ''
        }`}>
        <div
          className={`flex items-center ${
            !open ? 'max-w-0' : 'max-w-[132px]'
          } transition-all duration-300`}>
          <a
            href='https://zalo.me/0899320427'
            target='_blank'
            rel='noreferrer'
            className='p-2 wiggle'
            onClick={() => setOpen(false)}>
            <Image src='/images/zalo.jpg' width={28} height={28} alt='zalo' />
          </a>
          <a
            href='https://www.messenger.com/t/170660996137385'
            target='_blank'
            rel='noreferrer'
            className='p-2 wiggle'
            onClick={() => setOpen(false)}>
            <Image src='/images/messenger.jpg' width={28} height={28} alt='zalo' />
          </a>
          <a
            href='mailto:anphashop.beta@gmail.com'
            target='_blank'
            rel='noreferrer'
            className='p-2 wiggle'
            onClick={() => setOpen(false)}>
            <Image src='/images/gmail.jpg' width={28} height={28} alt='gmail' />
          </a>
        </div>

        <button
          className='group flex items-center justify-center h-[44px] w-[44px]'
          onClick={() => setOpen(!open)}>
          <FaChevronLeft
            size={20}
            className={`group-hover:scale-125 ${open ? 'rotate-180' : ''} common-transition text-white`}
          />
        </button>
      </div>
    </>
  )
}

export default ContactFloating
