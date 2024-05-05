'use client'

import Divider from '@/components/Divider'
import { admins } from '@/constansts'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { IoIosHelpCircle } from 'react-icons/io'

function RechargePage() {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  // values
  const admin: any = admins[(process.env.NEXT_PUBLIC_ADMIN! as keyof typeof admins) || 'KHOA']

  // handle copy
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Đã sao chép: ' + text)
  }, [])

  const content = 'NAP ' + curUser?.email.split('@')[0]

  return (
    <div className='bg-white rounded-medium shadow-medium mt-20 p-21'>
      <h1 className='text-center font-semibold text-4xl mb-2'>Nạp tiền vào tài khoản</h1>
      <p className='text-center font-[500]'>
        Để mua tài khoản, hãy nạp tiền vào tài khoản qua 2 hình thức sau nhá!
      </p>

      <Divider size={12} />

      <div className='grid grid-cols-1 gap-7 lg:grid-cols-2 font-semibold pb-16'>
        {/* MARK: Momo */}
        <div className='col-span-1'>
          <h2 className='text-2xl text-[#a1396c] text-center mb-3'>Chuyển khoản Momo</h2>

          <ul className='list-decimal font-semibold pl-6 mb-5'>
            <li>Vào ứng dụng momo của bạn trên điện thoại</li>
            <li>Chọn chức năng quét mã QR</li>
            <li>
              <br />
              <p>
                - Bấm vào link sau:{' '}
                <a className='text-[#a1396c]' href={admin.momo.link}>
                  Link thanh toán bằng Momo
                </a>
              </p>
              <p>(hoặc)</p>
              <p>- Quét mã QR bên dưới</p>
            </li>
            <li>Nhập số tiền bạn muốn nạp</li>
            <li>
              Nhập nội dung chuyển tiền:{' '}
              <span className='text-orange-600 cursor-pointer' onClick={() => handleCopy(content)}>
                {content}
              </span>
            </li>
            <li>
              Hoàn tất quá trình nạp tiền (tên người nhận:{' '}
              <span
                className='text-green-500 cursor-pointer'
                onClick={() => handleCopy(admin.momo.receiver)}>
                {admin.momo.receiver}
              </span>
              )
            </li>
          </ul>

          <p>Sau từ 1 - 5 phút tài khoản của bạn sẽ được cộng tiền.</p>
          <p>
            *Nếu không thấy được cộng tiền thì liên hệ đến admin để được giải quyết nhá:{' '}
            <a className='text-sky-500' href={admin.zalo}>
              {admin.zalo}
            </a>
          </p>

          <div className='flex justify-center mt-6'>
            <div className='relative rounded-lg shadow-medium duration-300 transition hover:-translate-y-2 overflow-hidden'>
              <Image src={admin.momo.image} height={700} width={350} alt='momo-qr' />
              <Image
                className='absolute top-[56%] left-1/2 -translate-x-1/2 -translate-y-[50%] w-[58%]'
                src={`https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=2|99|${admin.momo.account}|||0|0|0|${content}|transfer_p2p`}
                height={700}
                width={350}
                alt='momo-qr'
              />
              <Image
                className='bg-[#333] absolute top-[56%] left-1/2 -translate-x-1/2 -translate-y-[50%] rounded-md p-1 w-[12%]'
                src='/images/logo.jpg'
                height={42}
                width={42}
                alt='momo-qr'
              />
            </div>
          </div>

          <p className='mt-8 mb-2'>
            *Nếu không quét được thì bạn có thể nhập thông tin chuyển khoản tại đây:
          </p>

          <div className='border border-slate-400 py-2 px-4 rounded-md mb-1'>
            <p>
              Số tài khoản Momo:{' '}
              <span
                className='text-[#a1396c] font-semibold cursor-pointer'
                onClick={() => handleCopy(admin.momo.account)}>
                {admin.momo.account}
              </span>
            </p>
            <p>
              Nội dung chuyển khoản:{' '}
              <span className='text-orange-600 cursor-pointer' onClick={() => handleCopy(content)}>
                {content}
              </span>
            </p>
          </div>
          <p className='flex items-center gap-1 text-slate-500 mb-1'>
            <IoIosHelpCircle size={20} /> Ấn để sao chép
          </p>

          <p>
            *Nếu không thấy được cộng tiền thì liên hệ đến admin để được giải quyết nhá:{' '}
            <a className='text-sky-500' href={admin.zalo}>
              {admin.zalo}
            </a>
          </p>
        </div>

        {/* MARK: Banking */}
        <div className='col-span-1'>
          <h2 className='text-2xl text-[#399162] text-center mb-3'>Chuyển khoản ngân hàng</h2>

          <ul className='list-decimal font-semibold pl-6 mb-5'>
            <li>Vào ứng dụng ngân hàng của bạn trên điện thoại</li>
            <li>Chọn chức năng quét mã QR</li>
            <li>
              <br />
              <p>
                - Bấm vào link sau:{' '}
                <a
                  className='text-[#399162]'
                  href={`https://dl.vietqr.io/pay?app=vcb&ba=1040587211@vcb&tn=${content}`}>
                  Link thanh toán bằng Vietcombank
                </a>
              </p>
              <p>(hoặc)</p>
              <p>- Quét mã QR bên dưới</p>
            </li>
            <li>Nhập số tiền bạn muốn nạp</li>
            <li>
              Nhập nội dung chuyển tiền:{' '}
              <span className='text-orange-600 cursor-pointer' onClick={() => handleCopy(content)}>
                {content}
              </span>
            </li>
            <li>
              Hoàn tất quá trình nạp tiền (tên người nhận:{' '}
              <span
                className='text-green-500 cursor-pointer'
                onClick={() => handleCopy(admin.banking.receiver)}>
                {admin.banking.receiver}
              </span>
            </li>
          </ul>

          <p>Sau từ 1 - 5 phút tài khoản của bạn sẽ được cộng tiền.</p>
          <p>
            *Nếu không thấy được cộng tiền thì liên hệ đến admin để được giải quyết nhá:{' '}
            <a className='text-sky-500' href={admin.zalo}>
              {admin.zalo}
            </a>
          </p>

          <div className='flex justify-center mt-6'>
            <div className='relative rounded-lg shadow-medium duration-300 transition hover:-translate-y-2 overflow-hidden'>
              <Image src={admin.banking.image} height={700} width={350} alt='banking-qr' />
              <Image
                className='absolute top-[41%] left-1/2 -translate-x-1/2 -translate-y-[50%] w-[47%]'
                src={`https://img.vietqr.io/image/970436-1040587211-eeua38J.jpg?addInfo=${encodeURI(
                  content
                )}&accountName=${admin.banking.receiver}`}
                height={700}
                width={350}
                alt='banking-qr'
              />
            </div>
          </div>

          <p className='mt-8 mb-2'>
            *Nếu không quét được thì bạn có thể nhập thông tin chuyển khoản tại đây:
          </p>

          <div className='border border-slate-400 py-2 px-4 rounded-md mb-1'>
            <p>
              Ngân hàng:{' '}
              <span
                className='text-[#399162] font-semibold cursor-pointer'
                onClick={() => handleCopy(admin.banking.name)}>
                {admin.banking.name}
              </span>
            </p>
            <p>
              Số tài khoản:{' '}
              <span
                className='text-secondary font-semibold cursor-pointer'
                onClick={() => handleCopy(admin.banking.account)}>
                {admin.banking.account}
              </span>
            </p>
            <p>
              Nội dung chuyển khoản:{' '}
              <span className='text-orange-600 cursor-pointer' onClick={() => handleCopy(content)}>
                {content}
              </span>
            </p>
          </div>
          <p className='flex items-center gap-1 text-slate-500 mb-1'>
            <IoIosHelpCircle size={20} /> Ấn để sao chép
          </p>

          <p>
            *Nếu không thấy được cộng tiền thì liên hệ đến admin để được giải quyết nhá:{' '}
            <a className='text-sky-500' href={admin.zalo}>
              {admin.zalo}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RechargePage
