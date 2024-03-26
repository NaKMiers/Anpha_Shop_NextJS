'use client'

import CartItem from '@/components/CartItem'
import { formatPrice } from '@/utils/formatNumber'
import Image from 'next/image'
import React from 'react'

function CheckoutPage({ params }: { params: { type: string } }) {
  const type = params.type

  return (
    <div className='mt-20 grid grid-cols-1 lg:grid-cols-12 gap-21 bg-white rounded-medium shadow-medium p-8 pb-16 text-dark'>
      {/* Payment info */}
      <div className='col-span-1 lg:col-span-7'>
        {type === 'momo' ? (
          <h1 className='text-4xl text-[#a1396c] text-center font-semibold'>Thanh toán Momo</h1>
        ) : (
          <h1 className='text-4xl text-[#62b866] text-center font-semibold'>Thanh toán BANKING</h1>
        )}

        <div className='pt-4' />

        <p className='text-secondary font-semibold mb-2'>
          * Hãy chuyển vào tài khoản bên dưới với nội dung sau:
        </p>
        {type === 'momo' && (
          <a href='https://me.momo.vn/anphashop'>
            Ấn vào link sau để chuyển nhanh:{' '}
            <span className='text-sky-500'>https://me.momo.vn/anphashop</span>
          </a>
        )}

        <div className='border border-slate-400 py-2 px-4 rounded-md mb-2'>
          <p>
            Ngân hàng: <span className='text-[#399162] font-semibold'>Vietcombank</span>
          </p>
          {type === 'momo' ? (
            <p>
              Số tài khoản Momo: <span className='text-[#a1396c] font-semibold'>0899320427</span>
            </p>
          ) : (
            <p>
              Số tài khoản: <span className='text-secondary font-semibold'>1040587211</span>
            </p>
          )}
          <p>
            Số tiền chuyển: <span className='text-green-500 font-semibold'>{formatPrice(59000)}</span>
          </p>
          <p>
            Nội dung chuyển khoản: <span className='text-yellow-400 font-semibold'>B09E9</span>
          </p>
        </div>

        <p className=''>
          Tài khoản sẽ được gửi cho bạn qua email:{' '}
          <span className='text-green-500'>diwas118151@gmail.com</span>
        </p>

        <p className='italic text-sky-500'>
          Lưu ý: nhấn vào nút <span className='text-secondary underline'>xác nhận thanh toán</span> bên
          dưới sau khi đã chuyển khoản để có thể nhận Email.
        </p>

        <Image
          className='mx-auto mt-6 rounded-lg shadow-medium duration-300 transition hover:-translate-y-2'
          src={type === 'momo' ? '/images/momo-qr.jpg' : '/images/banking-qr.jpg'}
          height={700}
          width={350}
          alt='momo-qr'
        />

        <button className='mt-12 text-xl font-semibold rounded-lg w-full p-2 bg-primary hover:bg-secondary hover:text-light common-transition'>
          Xác nhận thanh toán
        </button>
      </div>

      {/* Cart items */}
      <div className='col-span-1 lg:col-span-5'>
        <h1 className='text-center font-semibold text-3xl'>Sản phẩm</h1>

        <div className='pt-5' />

        <div>
          {/* {Array.from({ length: 3 }).map((_, index) => (
            <CartItem className={index != 0 ? 'mt-4' : ''} key={index} isLocalCartItem isCheckout />
          ))} */}
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
