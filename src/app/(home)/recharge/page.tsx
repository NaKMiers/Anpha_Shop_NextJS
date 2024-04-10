'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useCallback } from 'react'
import toast from 'react-hot-toast'

function RechargePage() {
  const { data: session } = useSession()
  const curUser: any = session?.user

  // handle copy
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Đã sao chép: ' + text)
  }, [])

  return (
    <div className='bg-white rounded-medium shadow-medium mt-20 p-21'>
      <h1 className='text-center font-semibold text-4xl mb-2'>Nạp tiền vào tài khoản</h1>
      <p className='text-center font-[500]'>
        Để mua tài khoản, hãy nạp tiền vào tài khoản qua 2 hình thức sau nhá!
      </p>

      <div className='pt-12' />

      <div className='grid grid-cols-1 gap-21 lg:grid-cols-2 font-semibold pb-16'>
        {/* Momo */}
        <div className='col-span-1'>
          <h2 className='text-2xl text-[#a1396c] text-center mb-3'>Chuyển khoản Momo</h2>

          <ul className='list-decimal font-semibold pl-6 mb-5'>
            <li>Vào ứng dụng momo của bạn trên điện thoại</li>
            <li>Chọn chức năng quét mã QR</li>
            <li>
              <br />
              <p>
                - Bấm vào link sau:{' '}
                <a className='text-[#a1396c]' href='https://me.momo.vn/anphashop'>
                  https://me.momo.vn/anphashop
                </a>
              </p>
              <p>(hoặc)</p>
              <p>- Quét mã QR bên dưới</p>
            </li>
            <li>Nhập số tiền bạn muốn nạp</li>
            <li>
              Nhập nội dung chuyển tiền:{' '}
              <span
                className='text-orange-600 cursor-pointer'
                onClick={() => handleCopy(`NAP ${curUser?.email}`)}>
                NAP {curUser?.email}
              </span>
            </li>
            <li>
              Hoàn tất quá trình nạp tiền (tên người nhận:{' '}
              <span className='text-green-500'>Nguyễn Anh Khoa</span>)
            </li>
          </ul>

          <p>Sau từ 1 - 5 phút tài khoản của bạn sẽ được cộng tiền.</p>
          <p>
            *Nếu không thấy được cộng tiền thì liên hệ đến admin để được giải quyết nhá:{' '}
            <a className='text-sky-500' href='https://zalo.me/0899320427'>
              https://zalo.me/0899320427
            </a>
          </p>

          <Image
            className='mx-auto mt-6 rounded-lg shadow-medium duration-300 transition hover:-translate-y-2'
            src='/images/momo-qr.jpg'
            height={700}
            width={350}
            alt='momo-qr'
          />

          <p className='mt-8 mb-2'>
            *Nếu không quét được thì bạn có thể nhập thông tin chuyển khoản tại đây:
          </p>

          <div className='border border-slate-400 py-2 px-4 rounded-md mb-2'>
            <p>
              Số tài khoản Momo:{' '}
              <span
                className='text-[#a1396c] font-semibold cursor-pointer'
                onClick={() => handleCopy('0899320427')}>
                0899320427
              </span>
            </p>
            <p>
              Nội dung chuyển khoản:{' '}
              <span
                className='text-orange-600 cursor-pointer'
                onClick={() => handleCopy(`NAP ${curUser?.email}`)}>
                NAP {curUser?.email}
              </span>
            </p>
          </div>

          <p>
            *Nếu không thấy được cộng tiền thì liên hệ đến admin để được giải quyết nhá:{' '}
            <a className='text-sky-500' href='https://zalo.me/0899320427'>
              https://zalo.me/0899320427
            </a>
          </p>
        </div>

        {/* Banking */}
        <div className='col-span-1'>
          <h2 className='text-2xl text-[#399162] text-center mb-3'>Chuyển khoản ngân hàng</h2>

          <ul className='list-decimal font-semibold pl-6 mb-5'>
            <li>Vào ứng dụng momo của bạn trên điện thoại</li>
            <li>Chọn chức năng quét mã QR</li>
            <li>Quét mã QR bên dưới</li>
            <li>Nhập số tiền bạn muốn nạp</li>
            <li>
              Nhập nội dung chuyển tiền:{' '}
              <span
                className='text-orange-600 cursor-pointer'
                onClick={() => handleCopy(`NAP ${curUser?.email}`)}>
                NAP {curUser?.email}
              </span>
            </li>
            <li>
              Hoàn tất quá trình nạp tiền (tên người nhận:{' '}
              <span className='text-green-500'>Nguyễn Anh Khoa</span>)
            </li>
          </ul>

          <p>Sau từ 1 - 5 phút tài khoản của bạn sẽ được cộng tiền.</p>
          <p>
            *Nếu không thấy được cộng tiền thì liên hệ đến admin để được giải quyết nhá:{' '}
            <a className='text-sky-500' href='https://zalo.me/0899320427'>
              https://zalo.me/0899320427
            </a>
          </p>

          <Image
            className='mx-auto mt-6 rounded-lg shadow-medium duration-300 transition hover:-translate-y-2'
            src='/images/banking-qr.jpg'
            height={700}
            width={350}
            alt='momo-qr'
          />

          <p className='mt-8 mb-2'>
            *Nếu không quét được thì bạn có thể nhập thông tin chuyển khoản tại đây:
          </p>

          <div className='border border-slate-400 py-2 px-4 rounded-md mb-2'>
            <p>
              Ngân hàng:{' '}
              <span
                className='text-[#399162] font-semibold cursor-pointer'
                onClick={() => handleCopy('Vietcombank')}>
                Vietcombank
              </span>
            </p>
            <p>
              Số tài khoản:{' '}
              <span
                className='text-secondary font-semibold cursor-pointer'
                onClick={() => handleCopy('1040587211')}>
                1040587211
              </span>
            </p>
            <p>
              Nội dung chuyển khoản:{' '}
              <span
                className='text-orange-600 cursor-pointer'
                onClick={() => handleCopy(`NAP ${curUser?.email}`)}>
                NAP {curUser?.email}
              </span>
            </p>
          </div>

          <p>
            *Nếu không thấy được cộng tiền thì liên hệ đến admin để được giải quyết nhá:{' '}
            <a className='text-sky-500' href='https://zalo.me/0899320427'>
              https://zalo.me/0899320427
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RechargePage
