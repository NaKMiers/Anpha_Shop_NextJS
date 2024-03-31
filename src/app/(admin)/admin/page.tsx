import Heading from '@/components/Heading'
import { adminLinks } from '@/constansts'
import Link from 'next/link'

function AdminPage() {
  return (
    <div className='max-w-1200 mx-auto'>
      <Heading title='Nguyen Anh Khoa' />

      <div className='pt-2' />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-21 gap-21 rounded-medium shadow-medium-light bg-white'>
        {adminLinks.map(item => (
          <div className='text-dark' key={item.title}>
            <h2 className='font-semibold text-2xl mb-1'>{item.title}</h2>
            <ul className='border border-slate-200 rounded-lg overflow-hidden'>
              {item.links.map((link, index) => (
                <li key={link.href}>
                  <Link
                    className={`block py-2 px-4 common-transition hover:bg-primary hover:text-light border-t border-slate-200 ${
                      index === 0 ? 'border-t-0' : ''
                    }`}
                    href={link.href}>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPage
