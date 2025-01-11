import Link from 'next/link'
import { memo, ReactNode, useEffect, useState } from 'react'

interface AnnouncementBarProps {
  title: string
  href: string
  children: ReactNode
  className?: string
}

function AnnouncementBar({ title, href, children, className = '' }: AnnouncementBarProps) {
  // states
  const [openAds, setOpenAds] = useState<boolean>(true)

  // MARK: ADS
  useEffect(() => {
    const showTime = 5000
    const interval = 60000

    setTimeout(() => {
      setOpenAds(false)

      setInterval(() => {
        setOpenAds(true)

        setTimeout(() => {
          setOpenAds(false)
        }, showTime)
      }, interval)
    }, showTime)

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        setOpenAds(prev => !prev)
      }
    }

    window.addEventListener('keypress', handleKeyPress)

    return () => {
      window.removeEventListener('keypress', handleKeyPress)
    }
  }, [])

  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${openAds ? 'max-h-[200px] py-0.5 sm:max-h-12 md:max-h-6' : 'max-h-0 py-0'} trans-300 group block w-full overflow-hidden bg-gradient-to-t from-[#2f2e3e] to-primary px-3 text-center font-body text-sm tracking-wider text-light ${className}`}
      title={title}
    >
      {children}
    </Link>
  )
}

export default memo(AnnouncementBar)
