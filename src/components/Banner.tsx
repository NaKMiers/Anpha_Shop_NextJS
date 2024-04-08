'use client'

import { FullyProduct } from '@/app/api/product/[slug]/route'
import { ICategory } from '@/models/CategoryModel'
import { ITag } from '@/models/TagModel'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FaBoltLightning, FaChevronUp } from 'react-icons/fa6'
import CarouselProduct from './CarouselProduct'
import Header from './Header'
import Slider from './Slider'
import Carousel from './Carousel'

interface BannerProps {
  categories: ICategory[]
  tags: ITag[]
  carouselProducts: FullyProduct[]
}

function Banner({ carouselProducts = [], categories = [], tags = [] }: BannerProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <section className='h-screen py-21'>
      {/* Main Banner */}
      <div
        className='flex flex-col h-full w-full max-w-1200 mx-auto rounded-medium shadow-medium overflow-hidden bg-white bg-opacity-90'
        style={{ height: 'calc(100vh - 2 * 21px)' }}>
        {/* Header in Banner */}
        <Header isStatic />

        {/* Banner Content */}
        <div
          className='relative flex flex-col gap-21 p-21 overflow-hidden'
          style={{ height: 'calc(100% - 72px)' }}>
          {/* Top */}
          <div className='flex flex-grow h-2/3 justify-between gap-21'>
            {/* Tag */}
            <ul className='hidden lg:block min-w-[200px] bg-white p-2 pt-0 rounded-lg overflow-y-scroll'>
              <h5 className='pt-2 sticky top-0 bg-white text-[20px] font-semibold text-center text-dark'>
                Tags
              </h5>

              {tags?.map(tag => (
                <li
                  key={tag.title}
                  className='rounded-extra-small text-dark hover:bg-primary common-transition'>
                  <Link className='flex items-center px-[10px] py-[6px]' href={`/tag?tag=${tag.slug}`}>
                    <svg xmlns='http://www.w3.org/2000/svg' height='1.3em' viewBox='0 0 448 512'>
                      <path d='M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z'></path>
                    </svg>
                    <span className='ms-2'>{tag.title}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Slider */}
            <Slider
              time={5000}
              thumbs={[
                '/images/capcut-banner.jpg',
                '/images/netflix-banner.jpg',
                '/images/grammarly-banner.jpg',
              ]}>
              <Image
                src='/images/capcut-banner.jpg'
                alt='netflix'
                width={1200}
                height={768}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Image
                src='/images/netflix-banner.jpg'
                alt='netflix'
                width={1200}
                height={768}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Image
                src='/images/grammarly-banner.jpg'
                alt='netflix'
                width={1200}
                height={768}
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Slider>

            {/* Category */}
            <ul className='hidden lg:block min-w-[200px] bg-white p-2 rounded-lg overflow-y-scroll'>
              <h5 className='ml-2 text-[20px] font-semibold text-center text-dark'>Categories</h5>

              <li className='rounded-extra-small text-dark hover:bg-primary common-transition'>
                <Link className='flex items-center px-[10px] py-[6px] gap-2' href='/flashsale'>
                  <svg
                    className='animate-bounce'
                    xmlns='http://www.w3.org/2000/svg'
                    height='16'
                    width='12'
                    viewBox='0 0 384 512'>
                    <path
                      className='fill-secondary'
                      d='M0 256L28.5 28c2-16 15.6-28 31.8-28H228.9c15 0 27.1 12.1 27.1 27.1c0 3.2-.6 6.5-1.7 9.5L208 160H347.3c20.2 0 36.7 16.4 36.7 36.7c0 7.4-2.2 14.6-6.4 20.7l-192.2 281c-5.9 8.6-15.6 13.7-25.9 13.7h-2.9c-15.7 0-28.5-12.8-28.5-28.5c0-2.3 .3-4.6 .9-6.9L176 288H32c-17.7 0-32-14.3-32-32z'></path>
                  </svg>
                  <span className='font-bold text-secondary'>FLASHSALES</span>
                </Link>
              </li>

              {categories?.map(category => (
                <li
                  key={category.title}
                  className='rounded-extra-small text-dark hover:bg-primary common-transition'>
                  <Link
                    className='flex items-center px-[10px] py-[6px]'
                    href={`/category?ctg=${category.slug}`}>
                    <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 512 512'>
                      <path d='M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z'></path>
                    </svg>
                    <span className='ms-2'>{category.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom */}
          <div className='relative shrink-0 -mb-4'>
            <Carousel products={carouselProducts} />
          </div>

          {/* Menu Absolute */}
          <div
            className={`lg:hidden absolute top-0 left-0 w-full h-full bg-dark-100 bg-opacity-90 p-21 flex flex-col md:flex-row justify-evenly items-center md:items-start gap-21 transition-all duration-300 rounded-bl-small overflow-hidden`}
            style={{ transform: !isMenuOpen ? 'translate(calc(100% - 32px), calc(-100% + 32px))' : '' }}>
            <button
              className='absolute w-8 h-8 flex items-center justify-center top-0 right-0 shadow-md rounded-bl-lg p-[6px] bg-white'
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <FaChevronUp size={20} className='rotate-45 common-transition' />
            </button>

            <button
              className={`${
                isMenuOpen ? 'rounded-tr-lg' : ''
              } absolute w-8 h-8 flex items-center justify-center bottom-0 left-0 shadow-md p-[6px] bg-white`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <FaChevronUp
                size={20}
                className='common-transition group-hover:scale-110'
                style={{
                  transform: isMenuOpen ? 'rotate(45deg)' : 'rotate(-135deg)',
                }}
              />
            </button>

            {/* Tag */}
            <ul className='relative max-w-[300px] w-full bg-white p-2 pt-0 pb-6 rounded-medium shadow-small overflow-y-scroll'>
              <h5 className='bg-white pt-2 sticky top-0 text-[20px] font-semibold text-center text-dark z-10'>
                Tags
              </h5>

              {tags?.map(tag => (
                <li
                  key={tag.title}
                  className='rounded-extra-small text-dark hover:bg-primary common-transition'>
                  <Link className='flex items-center px-[10px] py-[6px]' href={`/tag?tag=${tag.slug}`}>
                    <svg xmlns='http://www.w3.org/2000/svg' height='1.3em' viewBox='0 0 448 512'>
                      <path d='M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z'></path>
                    </svg>
                    <span className='ms-2'>{tag.title}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Category */}
            <ul className='relative max-w-[300px] w-full bg-white p-2 pt-0 pb-6 rounded-medium shadow-small overflow-y-scroll'>
              <h5 className='bg-white pt-2 sticky top-0 text-[20px] font-semibold text-center text-dark z-10'>
                Categories
              </h5>

              <li className='rounded-extra-small text-dark hover:bg-primary common-transition'>
                <Link className='flex items-center px-[10px] py-[6px] gap-2' href='/flashsale'>
                  <FaBoltLightning size={16} className='text-secondary animate-bounce' />
                  <span className='font-bold text-secondary'>FLASHSALES</span>
                </Link>
              </li>

              {categories?.map(category => (
                <li
                  key={category.title}
                  className='rounded-extra-small text-dark hover:bg-primary common-transition'>
                  <Link
                    className='flex items-center px-[10px] py-[6px]'
                    href={`/category?ctg=${category.slug}`}>
                    <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 512 512'>
                      <path d='M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z'></path>
                    </svg>
                    <span className='ms-2'>{category.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner
