'use client'

import { FullyProduct } from '@/app/api/product/[slug]/route'
import { ICategory } from '@/models/CategoryModel'
import { ITag } from '@/models/TagModel'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BiSolidCategoryAlt } from 'react-icons/bi'
import { FaTag } from 'react-icons/fa'
import { FaBoltLightning, FaChevronUp } from 'react-icons/fa6'
import Carousel from './Carousel'
import Header from './Header'
import Slider from './Slider'

interface BannerProps {
  categories: ICategory[]
  tags: ITag[]
  carouselProducts: FullyProduct[]
}

function Banner({ carouselProducts = [], categories = [], tags = [] }: BannerProps) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [width, setWidth] = useState<number>(0)

  console.log('width: ', width)

  // set width
  useEffect(() => {
    // handle resize
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    // initial width
    setWidth(window.innerWidth)

    // add event listener
    window.addEventListener('resize', handleResize)

    // remove event listener
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <section className='h-screen py-21'>
      {/* Main Banner */}
      <div
        className='flex flex-col h-full w-full max-w-1200 mx-auto rounded-medium shadow-medium overflow-hidden bg-white bg-opacity-90'
        style={{ height: 'calc(100vh - 2 * 21px)' }}>
        {/* Header in Banner */}
        <Header />

        {/* Banner Content */}
        <div
          className='relative flex flex-col gap-21 p-21 overflow-hidden'
          style={{ height: 'calc(100% - 72px)' }}>
          {/* Top */}
          <div className='flex flex-grow h-2/3 justify-between gap-21'>
            {/* Tag */}
            <ul className='hidden lg:block min-w-[200px] bg-white p-2 pt-0 rounded-lg overflow-y-scroll'>
              <h5 className='pt-2 sticky top-0 bg-white text-[20px] font-semibold text-center text-dark'>
                Tag
              </h5>

              {tags?.map(tag => (
                <li
                  className='group rounded-extra-small text-dark hover:bg-primary common-transition'
                  key={tag.title}>
                  <Link className='flex items-center px-[10px] py-[6px]' href={`/tag?tag=${tag.slug}`}>
                    <FaTag size={16} className='wiggle' />
                    <span className='ms-2'>{tag.title}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Slider */}
            <Slider
              time={5000}
              mobile={width < 576 && width > 0}
              thumbs={
                width < 576 && width > 0
                  ? [
                      '/images/netflix-banner-mobile.jpg',
                      '/images/grammarly-banner-mobile.jpg',
                      '/images/capcut-banner-mobile.jpg',
                    ]
                  : [
                      '/images/netflix-banner.jpg',
                      '/images/grammarly-banner.jpg',
                      '/images/capcut-banner.jpg',
                    ]
              }>
              <Image
                src={
                  width < 576 && width > 0
                    ? '/images/netflix-banner-mobile.jpg'
                    : '/images/netflix-banner.jpg'
                }
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
                src={
                  width < 576 && width > 0
                    ? '/images/grammarly-banner-mobile.jpg'
                    : '/images/grammarly-banner.jpg'
                }
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
                src={
                  width < 576 && width > 0
                    ? '/images/capcut-banner-mobile.jpg'
                    : '/images/capcut-banner.jpg'
                }
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
              <h5 className='ml-2 text-[20px] font-semibold text-center text-dark'>Thể loại</h5>

              <li className='group rounded-extra-small text-dark hover:bg-primary common-transition'>
                <Link className='flex items-center px-[10px] py-[6px] gap-2' href='/flashsale'>
                  <FaBoltLightning size={16} className='wiggle text-secondary' />
                  <span className='font-bold text-secondary'>FLASHSALES</span>
                </Link>
              </li>

              {categories?.map(category => (
                <li
                  className='group rounded-extra-small text-dark hover:bg-primary common-transition'
                  key={category.title}>
                  <Link
                    className='flex items-center px-[10px] py-[6px]'
                    href={`/category?ctg=${category.slug}`}>
                    <BiSolidCategoryAlt size={17} className='wiggle' />
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
            className={`lg:hidden absolute z-10 top-0 left-0 w-full h-full bg-dark-100 bg-opacity-90 px-21 py-9 flex flex-col sm:flex-row justify-evenly items-start md:items-start gap-21 transition-all duration-300 rounded-bl-small overflow-hidden`}
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
            <ul className='relative sm:max-w-[300px] w-full bg-white p-2 pt-0 pb-6 rounded-lg shadow-small overflow-y-scroll'>
              <h5 className='bg-white pt-2 sticky top-0 text-[20px] font-semibold text-center text-dark z-10'>
                Tags
              </h5>

              {tags?.map(tag => (
                <li
                  className='group rounded-extra-small text-dark hover:bg-primary common-transition'
                  key={tag.title}>
                  <Link className='flex items-center px-[10px] py-[6px]' href={`/tag?tag=${tag.slug}`}>
                    <FaTag size={16} className='wiggle' />
                    <span className='ms-2'>{tag.title}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Category */}
            <ul className='relative sm:max-w-[300px] w-full bg-white p-2 pt-0 pb-6 rounded-lg shadow-small overflow-y-scroll'>
              <h5 className='bg-white pt-2 sticky top-0 text-[20px] font-semibold text-center text-dark z-10'>
                Thể loại
              </h5>

              <li className='group rounded-extra-small text-dark hover:bg-primary common-transition'>
                <Link className='flex items-center px-[10px] py-[6px] gap-2' href='/flashsale'>
                  <FaBoltLightning size={16} className='wiggle text-secondary' />
                  <span className='font-bold text-secondary'>FLASHSALES</span>
                </Link>
              </li>

              {categories?.map(category => (
                <li
                  className='group rounded-extra-small text-dark hover:bg-primary common-transition'
                  key={category.title}>
                  <Link
                    className='flex items-center px-[10px] py-[6px]'
                    href={`/category?ctg=${category.slug}`}>
                    <BiSolidCategoryAlt size={17} className='wiggle' />
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
