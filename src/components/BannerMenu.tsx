import { ICategory } from '@/models/CategoryModel'
import { ITag } from '@/models/TagModel'
import Link from 'next/link'
import React from 'react'
import { BiSolidCategoryAlt } from 'react-icons/bi'
import { FaTag } from 'react-icons/fa'
import { FaBoltLightning } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'

interface BannerMenuProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  categories: ICategory[]
  tags: ITag[]
}

function BannerMenu({ open, setOpen, categories, tags }: BannerMenuProps) {
  return (
    <>
      {/* MARK: Overlay */}
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 ${!open ? 'hidden' : ''}`}
        onClick={() => setOpen(false)}
      />
      {/* MARK: Main */}
      <div
        className={`lg:hidden absolute z-10 top-0 left-0 w-full h-full bg-dark-100 bg-opacity-90 flex flex-col sm:flex-row justify-evenly items-start md:items-start gap-21 transition-all duration-300 rounded-bl-small overflow-hidden ${
          open ? 'max-h-[calc(100vh_-_72px_-_21px*2)] px-21 py-9' : 'max-h-0'
        }`}
        onClick={() => setOpen(false)}>
        <button className='absolute top-0 right-0 rounded-lg group p-2' onClick={() => setOpen(false)}>
          <IoClose size={24} className='text-white wiggle' />
        </button>

        {/* MARK: Tag */}
        <ul
          className='relative sm:max-w-[300px] w-full bg-white p-2 pt-0 pb-6 rounded-lg shadow-small overflow-y-scroll'
          onClick={e => e.stopPropagation()}>
          <h5 className='bg-white pt-2 sticky top-0 text-[20px] font-semibold text-center text-dark z-10'>
            Tags
          </h5>

          {tags?.map(tag => (
            <li
              className='group rounded-extra-small text-dark hover:bg-primary common-transition'
              key={tag.title}>
              <Link
                href={`/tag?tag=${tag.slug}`}
                prefetch={false}
                className='flex items-center px-[10px] py-[6px]'>
                <FaTag size={16} className='wiggle' />
                <span className='ms-2'>{tag.title}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* MARK: Category */}
        <ul
          className='relative sm:max-w-[300px] w-full bg-white p-2 pt-0 pb-6 rounded-lg shadow-small overflow-y-scroll'
          onClick={e => e.stopPropagation()}>
          <h5 className='bg-white pt-2 sticky top-0 text-[20px] font-semibold text-center text-dark z-10'>
            Thể loại
          </h5>

          <li className='group rounded-extra-small text-dark hover:bg-primary common-transition'>
            <Link
              href='/flashsale'
              prefetch={false}
              className='flex items-center px-[10px] py-[6px] gap-2'>
              <FaBoltLightning size={16} className='wiggle text-secondary' />
              <span className='font-bold text-secondary'>FLASHSALES</span>
            </Link>
          </li>

          {categories?.map(category => (
            <li
              className='group rounded-extra-small text-dark hover:bg-primary common-transition'
              key={category.title}>
              <Link
                href={`/category?ctg=${category.slug}`}
                prefetch={false}
                className='flex items-center px-[10px] py-[6px]'>
                <BiSolidCategoryAlt size={17} className='wiggle' />
                <span className='ms-2'>{category.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default BannerMenu
