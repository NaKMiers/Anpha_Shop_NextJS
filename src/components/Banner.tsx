import Image from 'next/image'
import Header from './Header'
import Link from 'next/link'

const tags = [
  {
    label: 'Giải trí',
    href: '/tag?tag=giai-tri',
  },
  {
    label: 'Xem phim',
    href: '/tag?tag=xem-phim',
  },
  {
    label: 'Dùng chung',
    href: '/tag?tag=dung-chung',
  },
  {
    label: 'Nghe nhạc',
    href: '/tag?tag=nghe-nhac',
  },
  {
    label: 'Học tập',
    href: '/tag?tag=hoc-tap',
  },
  {
    label: 'Tiếng Anh',
    href: '/tag?tag=tieng-anh',
  },
  {
    label: 'Thiết kế',
    href: '/tag?tag=thiet-ke',
  },
  {
    label: 'Vĩnh viễn',
    href: '/tag?tag=vinh-vien',
  },
  {
    label: 'Trí tuệ nhân tạo',
    href: '/tag?tag=tri-tue-nhan-tao',
  },
]

const categories = [
  {
    label: 'Netflix',
    href: '/category?ctg=netflix',
  },
  {
    label: 'Spotify',
    href: '/category?ctg=spotify',
  },
  {
    label: 'ChatGPT',
    href: '/category?ctg=chatgpt',
  },
  {
    label: 'Grammarly',
    href: '/category?ctg=grammarly',
  },
  {
    label: 'Canva',
    href: '/category?ctg=canva',
  },
  {
    label: 'Youtube',
    href: '/category?ctg=youtube',
  },
]

function Banner() {
  return (
    <div className='h-screen py-21'>
      {/* Main Banner */}
      <div className='h-full w-full max-w-1200 mx-auto rounded-medium shadow-medium overflow-hidden bg-white bg-opacity-90'>
        {/* Header in Banner */}
        <Header isStatic />

        {/* Banner Content */}
        <div className='flex flex-col gap-21 p-21'>
          {/* Top */}
          <div className='flex justify-between gap-21'>
            {/* Tag */}
            <div className='hidden lg:block min-w-[200px] bg-white p-2 rounded-lg'>
              <ul className=''>
                <h5 className='ml-2 text-[20px] font-semibold text-center text-dark'>Tags</h5>

                {tags.map(tag => (
                  <li
                    key={tag.label}
                    className='rounded-extra-small text-dark hover:bg-primary common-transition'>
                    <Link className='flex items-center px-[10px] py-[6px]' href={tag.href}>
                      <svg xmlns='http://www.w3.org/2000/svg' height='1.3em' viewBox='0 0 448 512'>
                        <path d='M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z'></path>
                      </svg>
                      <span className='ms-2'>{tag.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Slider */}
            <div id='default-carousel' className='relative w-full' data-carousel='slide'>
              <div className='relative h-56 overflow-hidden rounded-lg md:h-96'>
                <div className='duration-700 ease-in-out' data-carousel-item>
                  <Image
                    width={1920}
                    height={1080}
                    src='/images/watching-netflix-banner.jpg'
                    className='absolute block -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 h-full w-full object-cover'
                    alt='banner'
                  />
                </div>
              </div>
              <div className='absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse'>
                <button
                  type='button'
                  className='w-3 h-3 rounded-full bg-slate-400'
                  aria-current='true'
                  aria-label='Slide 1'
                  data-carousel-slide-to='0'></button>
                <button
                  type='button'
                  className='w-3 h-3 rounded-full bg-slate-400'
                  aria-current='false'
                  aria-label='Slide 2'
                  data-carousel-slide-to='1'></button>
                <button
                  type='button'
                  className='w-3 h-3 rounded-full bg-slate-400'
                  aria-current='false'
                  aria-label='Slide 3'
                  data-carousel-slide-to='2'></button>
                <button
                  type='button'
                  className='w-3 h-3 rounded-full bg-slate-400'
                  aria-current='false'
                  aria-label='Slide 4'
                  data-carousel-slide-to='3'></button>
                <button
                  type='button'
                  className='w-3 h-3 rounded-full bg-slate-400'
                  aria-current='false'
                  aria-label='Slide 5'
                  data-carousel-slide-to='4'></button>
              </div>
              <button
                type='button'
                className='absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none'
                data-carousel-prev>
                <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none'>
                  <svg
                    className='w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 6 10'>
                    <path
                      stroke='currentColor'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='2'
                      d='M5 1 1 5l4 4'
                    />
                  </svg>
                  <span className='sr-only'>Previous</span>
                </span>
              </button>
              <button
                type='button'
                className='absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none'
                data-carousel-next>
                <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none'>
                  <svg
                    className='w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 6 10'>
                    <path
                      stroke='currentColor'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='2'
                      d='m1 9 4-4-4-4'
                    />
                  </svg>
                  <span className='sr-only'>Next</span>
                </span>
              </button>
            </div>

            {/* Category */}
            <div className='hidden lg:block min-w-[200px] bg-white p-2 rounded-lg'>
              <ul className=''>
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

                {categories.map(category => (
                  <li
                    key={category.label}
                    className='rounded-extra-small text-dark hover:bg-primary common-transition'>
                    <Link className='flex items-center px-[10px] py-[6px]' href={category.href}>
                      <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 512 512'>
                        <path d='M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z'></path>
                      </svg>
                      <span className='ms-2'>{category.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className='overflow-x-scroll'>
            <div className='flex items-center'>
              {Array.from({ length: 10 }).map((item, index) => (
                <div key={index} className='aspect-video w-1/3 lg:w-1/5 shrink-0 px-21/2'>
                  <div className='rounded-small overflow-hidden'>
                    <Image
                      src='/images/watching-netflix-banner.jpg'
                      width={1920}
                      height={1080}
                      alt='account'
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner
