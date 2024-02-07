import Image from 'next/image'
import { FaCartPlus } from 'react-icons/fa'
import { FaCircleCheck } from 'react-icons/fa6'
import Price from './Price'

function ProductCard() {
  return (
    <div className='relative w-full p-4 bg-white shadow-lg rounded-xl select-none'>
      <div className='aspect-video rounded-lg overflow-hidden shadow-lg'>
        <Image src='/images/watching-netflix-banner.jpg' width={1920} height={1080} alt='netflix' />
      </div>
      <h3 className='font-body text-[18px] text-dark tracking-wide leading-[22px] my-2'>
        Netflix Premium (Gói Share 1 Tháng) - Chia sẻ Niềm Vui Xem Phim Siêu Nét
      </h3>
      <div className='absolute -top-2 -left-2 rounded-tl-lg bg-yellow-400 p-1 max-w-10 text-light font-semibold font-body text-center text-[13px] leading-4 before:absolute before:left-0 before:bottom-1 before:translate-y-full before:border-l-[44px] before:border-l-yellow-400 before:border-b-[16px] before:border-b-transparent after:absolute after:right-0 after:bottom-1 after:translate-y-full after:border-r-[44px] after:border-r-yellow-400 after:border-b-[16px] after:border-b-transparent'>
        Giảm 83%
      </div>
      <Price className='mb-1' />
      <div className='flex items-center font-body tracking-wide'>
        <FaCircleCheck size={16} color='#003e70' />
        <span className='font-bold text-darker ml-1'>Đã bán:</span>
        <span className='text-red-500 ml-1'>202</span>
      </div>
      <div className='flex items-center justify-end md:justify-start gap-2 mt-1'>
        <button className='bg-secondary rounded-md text-white px-2 py-1 font-semibold font-body tracking-wider hover:bg-primary common-transition'>
          Mua ngay
        </button>
        <button className='bg-primary p-2 rounded-md'>
          <FaCartPlus size={18} color='#fff' />
        </button>
      </div>
    </div>
  )
}

export default ProductCard
