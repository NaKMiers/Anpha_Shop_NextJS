'use client'

import CartItem from '@/components/CartItem'
import Divider from '@/components/Divider'
import Gateway from '@/components/Gateway'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import useUtils from '@/libs/useUtils'
import { ICartItem } from '@/models/CartItemModel'
import { TPaymentMethod } from '@/models/OrderModel'
import { formatPrice } from '@/utils/number'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaChevronDown } from 'react-icons/fa'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { IoChatbox } from 'react-icons/io5'
import { TbLoader2 } from 'react-icons/tb'

function CheckoutPage({ params }: { params: { type: string } }) {
  // hooks
  const dispatch = useAppDispatch()
  const { handleCopy } = useUtils()
  const router = useRouter()

  // states
  const [checkout, setCheckout] = useState<any>(null)
  const [openProducts, setOpenProducts] = useState<boolean>(false)

  // values
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

  return (
    <div className="mt-20 grid grid-cols-1 gap-8 overflow-x-auto rounded-medium bg-white p-3 pb-16 pt-5 text-dark shadow-medium md:p-8 lg:grid-cols-12">
      {/* MARK: Payment info */}
      <div className="order-2 col-span-1 lg:order-first lg:col-span-7">
        {/* Gateway */}
        {checkout ? (
          <Gateway
            checkout={checkout}
            type={type as TPaymentMethod}
          />
        ) : (
          <div className="flex min-h-[200px] items-center justify-center">
            <TbLoader2
              size={55}
              className="animate-spin text-slate-300"
            />
          </div>
        )}

        <Divider size={2} />

        <p className="font-body">
          Sau 5 phút không nhận được tài khoản,{' '}
          <a
            href={process.env.NEXT_PUBLIC_MESSENGER}
            className="font-semibold text-sky-500 underline underline-offset-1"
          >
            liên hệ
          </a>{' '}
          shop{' '}
          <a
            href={process.env.NEXT_PUBLIC_MESSENGER}
            className="font-semibold text-sky-500 underline underline-offset-1"
          >
            tại đây
          </a>{' '}
          để được hỗ trợ ngay. Cảm ơn bạn!
        </p>
        <p className="font-body">
          Tài khoản sẽ được gửi đồng thời cho bạn qua email:{' '}
          <span
            className="cursor-pointer text-green-500 underline"
            onClick={() => handleCopy(checkout?.email)}
          >
            {checkout?.email}
          </span>
        </p>
        <p className="font-body">
          Hãy kiểm tra mục <span className="font-semibold text-rose-500">Spam/Thư Rác</span> nếu không
          tìm thấy email.
        </p>

        <div className="mt-8 flex items-center justify-center gap-21/2 md:gap-21">
          <a
            href={process.env.NEXT_PUBLIC_MESSENGER}
            target="_blank"
            className="flex items-center justify-center gap-2 rounded-md border border-slate-200/30 px-3 py-2 font-semibold shadow-lg md:min-w-[160px]"
          >
            <Image
              src="/images/messenger.jpg"
              width={24}
              height={24}
              alt="messenger"
            />
            <p className="text-sm md:text-base">Messenger</p>
          </a>
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_MAIL}`}
            target="_blank"
            className="flex items-center justify-center gap-2 rounded-md border border-slate-200/30 px-3 py-2 font-semibold shadow-lg md:min-w-[160px]"
          >
            <Image
              src="/images/gmail.jpg"
              width={24}
              height={24}
              alt="gmail"
            />
            <p className="text-sm md:text-base">Gmail</p>
          </a>
        </div>
      </div>

      {/* MARK: Cart items */}
      <div className="col-span-1 lg:col-span-5">
        <h1 className="text-center text-3xl font-semibold">Sản phẩm</h1>

        <Divider size={5} />

        <div>
          <div
            className={`trans-300 md:!max-h-max ${openProducts ? 'max-h-[400px] overflow-y-auto' : 'max-h-0 overflow-hidden'}`}
          >
            {checkout?.items.map((cartItem: ICartItem, index: number) => (
              <CartItem
                cartItem={cartItem}
                className={index != 0 ? 'mt-4' : ''}
                key={cartItem._id}
                localCartItem
                isCheckout
              />
            ))}

            <Divider
              size={7}
              border
            />

            {!!checkout?.discount && (
              <div className="flex items-center justify-between">
                <span>Ưu đãi:</span>
                <span className="font-semibold text-yellow-500">
                  {formatPrice(checkout?.discount || 0)}
                </span>
              </div>
            )}
          </div>

          <div
            className="mb-4 flex cursor-pointer flex-col overflow-hidden rounded-md shadow-md"
            onClick={() => setOpenProducts(prev => !prev)}
          >
            <div className="flex items-center justify-center bg-neutral-500 py-1 text-light md:hidden">
              <FaChevronDown
                className={`trans-200 ${openProducts ? 'rotate-180 md:rotate-0' : 'rotate-0'}`}
                size={16}
              />
            </div>
            <div className="flex items-end justify-between px-21/2 py-2">
              <span className="text-xl font-semibold">Thành tiền:</span>
              <span className="text-3xl font-semibold text-green-500">
                {formatPrice(checkout?.total || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* MARK: Action Buttons */}
        <div className="mt-6 hidden flex-wrap justify-center gap-x-21 gap-y-21/2 font-body tracking-wide sm:flex">
          <a
            href="/cart"
            className="trans-200 group flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-300 px-21 py-3 hover:bg-secondary hover:text-white"
            title="Quay lại giỏ hàng"
            onClick={() => localStorage.removeItem('checkout')}
          >
            <IoMdArrowRoundBack
              size={18}
              className="wiggle mb-[-2px] flex-shrink-0"
            />
            <span className="line-clamp-1 text-ellipsis">Quay lại giỏ hàng</span>
          </a>

          <a
            href={process.env.NEXT_PUBLIC_MESSENGER}
            className="trans-200 group flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-21 py-3 hover:bg-secondary hover:text-white"
            title="Liên hệ messenger"
            target="_blank"
          >
            <IoChatbox
              size={18}
              className="wiggle mb-[-2px] flex-shrink-0"
            />
            <span className="line-clamp-1 text-ellipsis">Liên hệ</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
