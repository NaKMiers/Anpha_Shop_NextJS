'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHistory, FaUser, FaUserLock } from 'react-icons/fa'

const data = [
  {
    title: 'Thông tin tài khoản',
    href: '/user',
    Icon: FaUser,
  },
  {
    title: 'Lịch sử mua hàng',
    href: '/user/order-history',
    subHref: '/user/order/',
    Icon: FaHistory,
  },
  {
    title: 'Mật khẩu - Bảo mật',
    href: '/user/security',
    Icon: FaUserLock,
  },
]

function UserMenu() {
  // hooks
  const pathname = usePathname()

  return (
    <ul className='h-full flex flex-row flex-shrink-0 gap-2 justify-evenly lg:flex-col w-full lg:w-1/4 md:min-w-[265px] p-21 bg-white rounded-medium shadow-medium'>
      {data.map(({ title, href, subHref, Icon }) => (
        <li key={href}>
          <Link
            className={`group flex items-center gap-2 group hover:bg-secondary hover:text-light hover:rounded-lg common-transition px-4 py-4 ${
              pathname === href || (subHref && pathname.startsWith(subHref))
                ? 'bg-primary rounded-lg text-light'
                : ''
            }`}
            href={href}>
            <Icon size={21} className='wiggle' />
            <span className='hidden md:block font-body text-[18px] font-semibold'>{title}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default UserMenu
