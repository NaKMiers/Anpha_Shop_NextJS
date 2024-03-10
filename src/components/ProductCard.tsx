import Image from 'next/image'
import { FaCartPlus } from 'react-icons/fa'
import { FaCircleCheck } from 'react-icons/fa6'
import Price from './Price'
import Link from 'next/link'

function ProductCard() {
  return (
    <div className='relative w-full p-4 bg-white shadow-lg rounded-xl select-none hover:-translate-y-1 transition duration-500'>
      <Link href='/netflix' className='aspect-video rounded-lg overflow-hidden shadow-lg block'>
        <div className='flex w-full overflow-x-scroll snap-x'>
          <Image
            className='flex-shrink snap-start'
            src='/images/watching-netflix-banner.jpg'
            width={1920}
            height={1080}
            alt='netflix'
          />
          <Image
            className='flex-shrink snap-start'
            src='/images/watching-netflix-banner.jpg'
            width={1920}
            height={1080}
            alt='netflix'
          />
          <Image
            className='flex-shrink snap-start'
            src='/images/watching-netflix-banner.jpg'
            width={1920}
            height={1080}
            alt='netflix'
          />
        </div>
      </Link>
      <Link href='/netflix'>
        <h3 className='font-body text-[18px] text-dark tracking-wide leading-[22px] my-3'>
          Netflix Premium (Gói Share 1 Tháng) - Chia sẻ Niềm Vui Xem Phim Siêu Nét
        </h3>
      </Link>
      <div className='absolute -top-2 -left-2 rounded-tl-lg rounded-br-lg bg-yellow-400 p-1 max-w-10 text-light font-semibold font-body text-center text-[13px] leading-4'>
        Giảm 83%
      </div>
      <Price className='mb-2' />
      <div className='flex items-center font-body tracking-wide'>
        <FaCircleCheck size={16} className='text-darker' />
        <span className='font-bold text-darker ml-1'>Đã bán:</span>
        <span className='text-red-500 ml-1'>202</span>
      </div>
      <div className='flex items-center justify-end md:justify-start gap-2 mt-2'>
        <button className='bg-secondary rounded-md text-white px-2 py-1 font-semibold font-body tracking-wider hover:bg-primary common-transition'>
          MUA NGAY
        </button>
        <button className='bg-primary px-2 py-[6px] rounded-md group hover:bg-secondary common-transition'>
          <FaCartPlus size={18} className='text-white group-hover:scale-110 common-transition' />
        </button>
      </div>
    </div>
  )
}

export default ProductCard
