import Heading from '@/components/Heading'
import { adminLinks } from '@/constansts'
import Link from 'next/link'
import { FaPlus } from 'react-icons/fa'

function AdminPage() {
  return (
    <div className='max-w-1200 mx-auto'>
      {/* MARK: Heading */}
      <Heading title='Admin' className='mt-0' />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-21 gap-21 rounded-medium shadow-medium-light bg-white'>
        {adminLinks.map(({ title, Icon, links }) => (
          <div className='text-dark' key={title}>
            <h2 className='font-semibold text-2xl mb-1'>{title}</h2>
            <ul className='border border-slate-200 rounded-lg overflow-hidden'>
              {links.map(({ title, href }, index) => (
                <li key={href}>
                  <Link
                    className={`group flex items-center gap-2 py-2 px-4 common-transition hover:bg-primary hover:text-light border-t border-slate-200 ${
                      index === 0 ? 'border-t-0' : ''
                    }`}
                    href={href}>
                    {index === 0 ? (
                      <Icon size={18} className='wiggle' />
                    ) : (
                      <div className='flex justify-center items-center flex-shrink-0 rounded-full p-[3px] border-2 border-dark group-hover:border-white common-transition'>
                        <FaPlus size={11} className='w-[11px] h-[11px] wiggle group-hover:text-white' />
                      </div>
                    )}
                    {title}
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
