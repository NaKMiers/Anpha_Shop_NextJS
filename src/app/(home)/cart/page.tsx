'use client'

import CartItem from '@/components/CartItem'
import { formatPrice } from '@/utils/formatNumber'
import Image from 'next/image'
import { useState } from 'react'
import { FaPlusSquare } from 'react-icons/fa'
import { FaCartShopping } from 'react-icons/fa6'

function CartPage() {
  const [voucherValue, setVoucherValue] = useState('')

  return (
    <div className='mt-20 grid grid-cols-1 md:grid-cols-3 gap-21 bg-white rounded-medium shadow-medium p-8 pb-16 text-dark'>
      {/* Cart Items */}
      <div className='col-span-1 md:col-span-2'>
        <h1 className='flex items-center gap-2 font-semibold font-body text-3xl'>
          <FaCartShopping size={30} className='text-dark' />
          <span>Giỏ hàng</span>
          <span>
            (<span className='text-primary font-normal'>3</span>)
          </span>
        </h1>

        <div className='pt-6' />

        {/* Local cart items */}
        <div className='border border-slate-400 p-4 rounded-medium'>
          <p className='text-primary italic mb-3'>
            Có một số sản phẩm hiện đang tồn tại trên máy của bạn, bấm vào nút{' '}
            <FaPlusSquare size={19} className='inline-block' /> bên dưới để thêm vào giỏ hàng.
          </p>

          {Array.from({ length: 3 }).map((_, index) => (
            <CartItem className={index != 0 ? 'mt-4' : ''} key={index} isLocalCartItem />
          ))}
        </div>

        <div className='pt-4' />

        {/* Database cart items */}

        <div>
          <div className='flex items-center justify-end gap-2 pr-21'>
            <label htmlFor='selectAll' className='font-semibold cursor-pointer'>
              Chọn tất cả
            </label>
            <input name='selectAll' id='selectAll' type='checkbox' className='size-5 cursor-pointer' />
          </div>

          <div className='pt-4' />

          {Array.from({ length: 3 }).map((_, index) => (
            <CartItem className={index != 0 ? 'mt-5' : ''} key={index} />
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className='col-span-1'>
        <div className='border border-slate-300 rounded-medium shadow-lg p-4 sticky mt-[60px] top-[88px] bg-sky-50'>
          <p className='mb-2'>
            Bạn có voucher? (<button className='text-sky-600 hover:underline z-10'>ấn vào đây</button>)
          </p>
          <div className='flex items-center gap-1 mb-2'>
            <input
              type='text'
              className='border w-full outline-secondary text-secondary border-slate-300 rounded-lg py-2 px-4'
              placeholder='Voucher'
              value={voucherValue}
              onChange={e => setVoucherValue(e.target.value.toUpperCase())}
            />
            <button className='rounded-lg border text-sky-600 border-sky-600 py-2 px-4 text-nowrap flex-shrink-0 hover:bg-sky-600 common-transition hover:text-light'>
              Áp dụng
            </button>
          </div>

          <p className='text-green-500 mb-2'>Bạn được -10000 vào tổng giá trị đơn hàng</p>

          <div className='flex items-center justify-between mb-2'>
            <span>Tổng tiền:</span>
            <span className='font-semibold'>{formatPrice(0)}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span>Voucher:</span>
            <span className='font-semibold text-yellow-400'>{formatPrice(0)}</span>
          </div>

          <div className='pt-2' />
          <hr />
          <div className='pt-2' />

          <div className='flex items-end justify-between mb-4'>
            <span className='font-semibold text-xl'>Thành tiền:</span>
            <span className='font-semibold text-3xl text-green-600'>{formatPrice(222222)}</span>
          </div>

          <div className='flex flex-col gap-3'>
            <button className='flex items-center justify-center rounded-xl gap-1 border border-primary py-2 group hover:bg-primary common-transition'>
              <Image src='/images/logo.jpg' height={32} width={32} alt='logo' />
              <span className='font-semibold ml-1 group-hover:text-light'>
                Mua ngay với {formatPrice(3761992)}
              </span>
            </button>

            <button className='flex items-center justify-center rounded-xl gap-2 border border-[#a1396c] py-2 group hover:bg-[#a1396c] common-transition'>
              <Image
                className='group-hover:border-white rounded-md border-2'
                src='/images/momo-icon.jpg'
                height={32}
                width={32}
                alt='logo'
              />
              <span className='font-semibold group-hover:text-light'>Mua nhanh với Momo</span>
            </button>

            <button className='flex items-center justify-center rounded-xl gap-2 border border-[#62b866] py-2 group hover:bg-[#62b866] common-transition'>
              <Image src='/images/banking-icon.jpg' height={32} width={32} alt='logo' />
              <span className='font-semibold group-hover:text-light'>Mua ngay với BANKING</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
