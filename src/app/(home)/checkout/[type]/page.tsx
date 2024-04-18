'use client'

import { FullyCartItem } from '@/app/api/cart/route'
import CartItem from '@/components/CartItem'
import Divider from '@/components/Divider'
import { admins } from '@/constansts'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { formatPrice } from '@/utils/number'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaBookOpen } from 'react-icons/fa'
import { IoIosHelpCircle, IoMdArrowRoundBack } from 'react-icons/io'

function CheckoutPage({ params }: { params: { type: string } }) {
  // hooks
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [checkout, setCheckout] = useState<any>(null)

  // values
  const admin = admins[(process.env.NEXT_PUBLIC_ADMIN! as keyof typeof admins) || 'KHOA']
  const type: string = params.type

  // MARK: Get Data
  // get checkout from local storage
  useEffect(() => {
    // stop page loading initially
    dispatch(setPageLoading(false))

    const checkout = JSON.parse(localStorage.getItem('checkout') ?? 'null')

    if (!checkout) {
      // start page loading for redirecting
      dispatch(setPageLoading(true))
      toast.error('Đang quay lại giỏ hàng...')
      router.push('/cart')
    } else {
      setCheckout(checkout)
    }
  }, [router, dispatch])

  // handle copy
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Đã sao chép: ' + text)
  }, [])

  return (
    <div className='mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-medium shadow-medium p-8 pb-16 text-dark overflow-x-auto'>
      {/* MARK: Payment info */}
      <div className='col-span-1 lg:col-span-7 order-2 lg:order-first'>
        {type === 'momo' ? (
          <h1 className='text-4xl text-[#a1396c] text-center font-semibold'>Thanh toán Momo</h1>
        ) : (
          <h1 className='text-4xl text-[#62b866] text-center font-semibold'>Thanh toán BANKING</h1>
        )}

        <div className='pt-4' />

        <p className='text-secondary font-semibold mb-2'>
          * Hãy chuyển vào tài khoản bên dưới với nội dung sau:{' '}
        </p>

        {type === 'momo' && (
          <a href='https://me.momo.vn/anphashop'>
            Ấn vào link sau để chuyển nhanh: <span className='text-[#a1396c]'>{admin.momo.link}</span>
          </a>
        )}

        <div className='border border-slate-400 py-2 px-4 rounded-md'>
          {type === 'banking' && (
            <p>
              Ngân hàng:{' '}
              <span
                className='text-[#399162] font-semibold cursor-pointer'
                onClick={() => handleCopy(admin.banking.name)}>
                {admin.banking.name}
              </span>
            </p>
          )}
          {type === 'momo' ? (
            <p>
              Số tài khoản Momo:{' '}
              <span
                className='text-[#a1396c] font-semibold cursor-pointer'
                onClick={() => handleCopy(admin.momo.account)}>
                {admin.momo.account}
              </span>
            </p>
          ) : (
            <p>
              Số tài khoản:{' '}
              <span
                className='text-secondary font-semibold cursor-pointer'
                onClick={() => handleCopy(admin.banking.account)}>
                {admin.banking.account}
              </span>
            </p>
          )}
          <p>
            Số tiền chuyển:{' '}
            <span
              className='text-green-500 font-semibold cursor-pointer'
              onClick={() => handleCopy(checkout?.total)}>
              {formatPrice(checkout?.total)}
            </span>
          </p>
          <p>
            Nội dung chuyển khoản:{' '}
            <span
              className='text-yellow-500 underline-offset-1 font-semibold cursor-pointer'
              onClick={() => handleCopy(checkout?.code)}>
              {checkout?.code}
            </span>
          </p>
        </div>
        <p className='flex items-center gap-1 text-slate-500 mb-1'>
          <IoIosHelpCircle size={20} /> Ấn để sao chép
        </p>

        <p className=''>
          Tài khoản sẽ được gửi cho bạn qua email:{' '}
          <span
            className='text-green-500 underline cursor-pointer'
            onClick={() => handleCopy(checkout?.email)}>
            {checkout?.email}
          </span>{' '}
          sau khi đã thanh toán.
        </p>

        <Image
          className='mx-auto mt-6 rounded-lg shadow-medium duration-300 transition hover:-translate-y-2'
          src={type === 'momo' ? admin.momo.image : admin.banking.image}
          height={700}
          width={350}
          alt={type === 'momo' ? 'momo-qr' : 'banking-qr'}
        />

        {/* MARK: Action Buttons */}
        <div className='flex lg:hidden justify-center flex-wrap mt-10 gap-x-21 gap-y-21/2 font-body tracking-wide'>
          <Link
            href={`/user/order/${checkout?.code}`}
            className='flex items-center justify-center gap-2 group rounded-lg px-21 py-3 bg-primary hover:bg-secondary hover:text-light common-transition'
            onClick={e => {
              if (!curUser?._id) {
                e.preventDefault()
                toast.error('Bạn cần có tài khoản để có thể xem thông tin đơn hàng ngay khi mua')
              } else {
                localStorage.removeItem('checkout')
              }
            }}
            title='Xem đơn hàng ngay'>
            <FaBookOpen size={18} className='wiggle mb-[-2px] flex-shrink-0' />
            <span className='text-ellipsis line-clamp-1'>Xem đơn hàng ngay</span>
          </Link>
          <a
            href={`/cart`}
            className='flex items-center justify-center gap-2 group rounded-lg px-21 py-3 bg-slate-300 hover:bg-secondary hover:text-light common-transition'
            title='Quay lại giỏ hàng'
            onClick={() => localStorage.removeItem('checkout')}>
            <IoMdArrowRoundBack size={18} className='wiggle mb-[-2px] flex-shrink-0' />
            <span className='text-ellipsis line-clamp-1'>Quay lại giỏ hàng</span>
          </a>
        </div>
      </div>

      {/* MARK: Cart items */}
      <div className='col-span-1 lg:col-span-5'>
        <h1 className='text-center font-semibold text-3xl'>Sản phẩm</h1>

        <Divider size={5} />

        <div>
          {checkout?.items.map((cartItem: FullyCartItem, index: number) => (
            <CartItem
              cartItem={cartItem}
              className={index != 0 ? 'mt-4' : ''}
              key={cartItem._id}
              localCartItem
              isCheckout
            />
          ))}

          <Divider size={7} border />

          {!!checkout?.discount && (
            <div className='flex items-center justify-between'>
              <span>Ưu đãi:</span>
              <span className='font-semibold text-yellow-500'>
                {formatPrice(checkout?.discount || 0)}
              </span>
            </div>
          )}

          <div className='flex items-end justify-between mb-4'>
            <span className='font-semibold text-xl'>Thành tiền:</span>
            <span className='font-semibold text-3xl text-green-500'>
              {formatPrice(checkout?.total || 0)}
            </span>
          </div>

          {/* MARK: Action Buttons */}
          <div className='hidden sm:flex justify-center flex-wrap mt-6 gap-x-21 gap-y-21/2 font-body tracking-wide'>
            <Link
              href={`/user/order/${checkout?.code}`}
              className='flex items-center justify-center gap-2 group rounded-lg px-21 py-3 bg-primary hover:bg-secondary hover:text-light common-transition'
              onClick={e => {
                if (!curUser?._id) {
                  e.preventDefault()
                  toast.error('Bạn cần có tài khoản để có thể xem thông tin đơn hàng ngay khi mua')
                } else {
                  localStorage.removeItem('checkout')
                }
              }}
              title='Xem đơn hàng ngay'>
              <FaBookOpen size={18} className='wiggle mb-[-2px] flex-shrink-0' />
              <span className='text-ellipsis line-clamp-1'>Xem đơn hàng ngay</span>
            </Link>
            <a
              href={`/cart`}
              className='flex items-center justify-center gap-2 group rounded-lg px-21 py-3 bg-slate-300 hover:bg-secondary hover:text-light common-transition'
              title='Quay lại giỏ hàng'
              onClick={() => localStorage.removeItem('checkout')}>
              <IoMdArrowRoundBack size={18} className='wiggle mb-[-2px] flex-shrink-0' />
              <span className='text-ellipsis line-clamp-1'>Quay lại giỏ hàng</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
