import Image from 'next/image'
import { FaHashtag, FaMinus, FaPlus, FaPlusSquare, FaTrashAlt } from 'react-icons/fa'
import Price from './Price'
import { TbPackages } from 'react-icons/tb'
import Link from 'next/link'

interface CartItemProps {
  isLocalCartItem?: boolean
  className?: string
  isCheckout?: boolean
}

function CartItem({ isLocalCartItem, isCheckout, className }: CartItemProps) {
  return (
    <div
      className={`relative flex flex-wrap md:flex-nowrap items-start gap-3 ${className} ${
        isLocalCartItem ? '' : 'rounded-medium border border-slate-400 p-21'
      }`}>
      <Link href='/netfix' className='min-w-[150px]'>
        <Image
          className='aspect-video rounded-lg'
          src='/images/netflix-banner.jpg'
          height={150}
          width={150}
          alt='thumbnail'
        />
      </Link>

      {isLocalCartItem && !isCheckout && (
        <div className='absolute z-10 top-1 right-4  flex flex-col gap-2'>
          <FaPlusSquare
            size={21}
            className='text-primary cursor-pointer hover:scale-110 common-transition'
          />
          <FaTrashAlt
            size={21}
            className='text-secondary cursor-pointer hover:scale-110 common-transition'
          />
        </div>
      )}

      {!isLocalCartItem && <input type='checkbox' className='size-5 absolute top-21 right-21' />}

      <div className={`relative h-full ${isLocalCartItem && !isCheckout ? 'pr-10' : ''}`}>
        <Link href='/netflix'>
          <h2 className={`text-[20px] tracking-wide mb-2 ${isLocalCartItem ? '' : 'pr-7'} leading-6`}>
            Spotify Premium (1 Năm) - Trải Nghiệm Âm Nhạc Chất Lượng Cao Suốt Cả Năm
          </h2>
        </Link>

        {isLocalCartItem ? (
          <div className='flex flex-col gap-3 text-xl font-body tracking-wide'>
            <div className='flex items-center gap-1 text-[16px]'>
              <FaHashtag className='text-darker' size={16} />
              <span className='text-darker font-bold text-nowrap'>Số lượng:</span>
              <span className='text-green-500'>2</span>
            </div>
          </div>
        ) : (
          <>
            <Price />
            <div className='flex items-center gap-1 mt-2 text-[16px]'>
              <TbPackages className='text-darker' size={22} />
              <span className='text-darker font-bold text-nowrap font-body tracking-wide'>Còn lại:</span>
              <span className='text-green-500'>61</span>
            </div>
          </>
        )}

        {/* Quantity */}
        {!isLocalCartItem && (
          <div className='flex items-center justify-between'>
            <div className='inline-flex border-[1.5px] border-secondary rounded-md overflow-hidden my-3'>
              <button className='flex items-center justify-center px-3 py-[10px] group hover:bg-secondary common-transition'>
                <FaMinus
                  size={16}
                  className='text-secondary group-hover:text-white group-hover:scale-110 common-transition'
                />
              </button>
              <input
                className='max-w-14 px-2 outline-none text-center text-lg text-dark font-semibold font-body border-x-[1.5px] border-secondary'
                type='text'
                inputMode='numeric'
                pattern='[0-9]*'
              />
              <button className='flex items-center justify-center px-3 py-[10px] group hover:bg-secondary common-transition'>
                <FaPlus
                  size={16}
                  className='text-secondary group-hover:text-white group-hover:scale-110 common-transition'
                />
              </button>
            </div>

            <FaTrashAlt
              size={21}
              className='text-secondary cursor-pointer hover:scale-110 common-transition'
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartItem
