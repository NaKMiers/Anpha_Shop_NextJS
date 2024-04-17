import { BiSolidCategoryAlt } from 'react-icons/bi'
import { FaTag } from 'react-icons/fa'
import Slider from '../Slider'
import LoadingCarousel from './LoadingCarousel'
import LoadingHeader from './LoadingHeader'

function Banner({ className = '' }: { className?: string }) {
  return (
    <section className={`h-screen py-21 ${className}`}>
      {/* Main Banner */}
      <div
        className='flex flex-col h-full w-full max-w-1200 mx-auto rounded-medium shadow-medium overflow-hidden bg-white bg-opacity-90'
        style={{ height: 'calc(100vh - 2 * 21px)' }}>
        {/* MARK: Header in Banner */}
        <LoadingHeader isStatic />

        {/* Banner Content */}
        <div
          className='relative flex flex-col gap-21 p-21 overflow-hidden'
          style={{ height: 'calc(100% - 72px)' }}>
          {/* MARK: Top */}
          <div className='flex flex-grow h-2/3 justify-between gap-21'>
            {/* Tag */}
            <ul className='hidden lg:block min-w-[200px] bg-white p-2 rounded-lg overflow-y-auto'>
              <div className='loading rounded-md w-20 h-6 mt-2 mb-3 mx-auto' />
              {Array.from({ length: 6 }).map((_, index) => (
                <li className='group rounded-extra-small text-dark' key={index}>
                  <div className='flex items-center px-[10px] py-[6px]'>
                    <FaTag size={16} />
                    <span className='ms-2 loading w-32 h-6 rounded-lg' />
                  </div>
                </li>
              ))}
            </ul>

            {/* Slider */}
            <Slider mobile={false}>
              <div className='w-full h-full loading rounded-lg' />
            </Slider>

            {/* Category */}
            <ul className='hidden lg:block min-w-[200px] bg-white p-2 rounded-lg overflow-y-auto'>
              <div className='loading rounded-md w-20 h-6 mt-2 mb-3 mx-auto' />
              {Array.from({ length: 6 }).map((_, index) => (
                <li className='group rounded-extra-small text-dark' key={index}>
                  <div className='flex items-center px-[10px] py-[6px]'>
                    <BiSolidCategoryAlt size={17} />
                    <span className='ms-2 loading w-32 h-6 rounded-lg' />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* MARK: Bottom */}
          <div className='relative shrink-0 -mb-4'>
            <LoadingCarousel />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner
