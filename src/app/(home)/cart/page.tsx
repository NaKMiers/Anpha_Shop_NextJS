'use client'

import CartItem from '@/components/CartItem'
import Input from '@/components/Input'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setSelectedItems } from '@/libs/reducers/cartReducer'
import { setLoading, setPageLoading } from '@/libs/reducers/modalReducer'
import { IVoucher } from '@/models/VoucherModel'
import { generateOrderCode } from '@/utils'
import { calcPercentage, formatPrice } from '@/utils/formatNumber'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaPlusSquare } from 'react-icons/fa'
import { FaCartShopping } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import { RiCoupon2Fill, RiDonutChartFill } from 'react-icons/ri'

function CartPage() {
  // hook
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  let cartLocalItems = useAppSelector(state => state.cart.localItems)
  let cartItems = useAppSelector(state => state.cart.items)
  const selectedCartItems = useAppSelector(state => state.cart.selectedItems)
  const router = useRouter()
  const { data: session } = useSession()
  const curUser: any = session?.user

  if (!curUser) {
    cartItems = cartLocalItems
  }

  // states
  const [isShowVoucher, setIsShowVoucher] = useState(false)
  const [voucher, setVoucher] = useState<IVoucher | null>(null)
  const [voucherMessage, setVoucherMessage] = useState<string>('')
  const [subTotal, setSubTotal] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
  } = useForm<FieldValues>({
    defaultValues: {
      email: curUser?.email || '',
      code: '',
    },
  })

  // calc total, discount, subTotal
  useEffect(() => {
    const subTotal = selectedCartItems.reduce((total, cartItem) => {
      const item: any = cartItems.find(cI => cI._id === cartItem._id)

      return total + item?.quantity * item?.product.price
    }, 0)
    setSubTotal(subTotal)

    let finalTotal = subTotal
    let discount = 0
    if (voucher) {
      if (voucher.type === 'fixed-reduce') {
        discount = +voucher.value
        finalTotal = subTotal - discount
      } else if (voucher.type === 'fixed') {
        discount = +voucher.value
        finalTotal = discount
      } else if (voucher.type === 'percentage') {
        discount = +calcPercentage(voucher.value, subTotal)
        finalTotal = subTotal - discount
      }
    }
    setDiscount(discount)
    setTotal(finalTotal)
  }, [selectedCartItems, voucher, cartItems])

  // send request to server to check voucher
  const handleApplyVoucher: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (selectedCartItems.length) {
        // start loading
        dispatch(setLoading(true))
        try {
          // send request to server
          const res = await axios.post(`/api/voucher/${data.code}/apply`, {
            email: data.email,
            total: subTotal,
          })
          const { voucher, message } = res.data

          // set voucher to state
          setVoucher(voucher)
          setVoucherMessage(message)

          // show success message
          toast.success(message)
        } catch (err: any) {
          const { message } = err.response.data
          console.log(err.message)
          toast.error(message)
          setVoucherMessage(message)
        } finally {
          // stop loading
          dispatch(setLoading(false))
        }
      } else {
        toast.error('Hãy chọn sản phẩm để tiến hành nhập voucher')
      }
    },
    [dispatch, selectedCartItems.length, subTotal]
  )

  // handle checkout
  const handleCheckout = useCallback(
    async (type: string) => {
      if (!selectedCartItems.length) {
        toast.error('Hãy chọn sản phẩm để tiến hành thanh toán')
        return
      }

      // set email
      if (!curUser) {
        const email = getValues('email')

        if (!email) {
          setError('email', { message: 'Email không được để trống' })
          return
        }
      }

      // start page loading
      dispatch(setPageLoading(true))

      // generate order code
      try {
        const res = await axios.get('/api/checkout/get-order-code')
        console.log(res.data.orderCode)

        // create checkout
        const checkout = {
          selectedCartItems,
          code: res.data.orderCode,
          email: curUser?.email || getValues('email'),
          voucher,
          discount,
          total,
        }
        localStorage.setItem('checkout', JSON.stringify(checkout))

        // move to checkout page
        router.push(`/checkout/${type}`)
      } catch (err: any) {
        console.log(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    },
    [router, curUser, dispatch, discount, getValues, selectedCartItems, voucher, total, setError]
  )

  return (
    <div className='mt-20 grid grid-cols-1 md:grid-cols-3 gap-21 bg-white rounded-medium shadow-medium p-8 pb-16 text-dark'>
      {/* Cart Items */}
      <div className='col-span-1 md:col-span-2'>
        <h1 className='flex items-center gap-2 font-semibold font-body text-3xl'>
          <FaCartShopping size={30} className='text-dark' />
          <span>Giỏ hàng</span>
          <span>
            (
            <span className='text-primary font-normal'>
              {curUser
                ? cartItems.reduce((total, item) => total + item.quantity, 0)
                : cartLocalItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
            )
          </span>
        </h1>

        <div className='pt-6' />

        {/* Local cart items */}
        {!!cartLocalItems.length && curUser && (
          <div className='border border-slate-400 p-4 rounded-medium'>
            <p className='text-primary italic mb-3'>
              Có một số sản phẩm hiện đang tồn tại trên máy của bạn, bấm vào nút{' '}
              <FaPlusSquare size={19} className='inline-block' /> bên dưới để thêm vào giỏ hàng.
            </p>

            {cartLocalItems.map((cartItem, index) => (
              <CartItem
                cartItem={cartItem}
                className={index != 0 ? 'mt-4' : ''}
                key={index}
                localCartItem
              />
            ))}
          </div>
        )}

        <div className='pt-4' />

        {/* Checkbox All */}
        {cartItems.length ? (
          <div>
            <div className='flex items-center justify-end gap-2 pr-21 select-none'>
              <label htmlFor='selectAll' className='font-semibold cursor-pointer '>
                {cartItems.length === selectedCartItems.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </label>
              <input
                name='selectAll'
                id='selectAll'
                type='checkbox'
                checked={cartItems.length === selectedCartItems.length}
                onChange={() =>
                  cartItems.length === selectedCartItems.length
                    ? dispatch(setSelectedItems([]))
                    : dispatch(setSelectedItems(cartItems))
                }
                className='size-5 cursor-pointer'
              />
            </div>

            <div className='pt-4' />

            {cartItems.map((cartItem, index) => (
              <CartItem cartItem={cartItem} className={index != 0 ? 'mt-5' : ''} key={index} />
            ))}
          </div>
        ) : (
          <p className='text-center'>
            Chưa có sản phẩm nào trong giỏ hàng của hàng. Hãy ấn vào{' '}
            <Link href='/' className='text-sky-500 underline'>
              đây
            </Link>{' '}
            để bắt đầu mua hàng.{' '}
            <Link className='text-sky-500 underline italic' href='/'>
              Quay lại
            </Link>
          </p>
        )}
      </div>

      {/* Order Summary */}
      <div className='col-span-1'>
        <div className='border-2 border-primary rounded-medium shadow-lg p-4 sticky mt-[60px] top-[88px] bg-sky-50 overflow-auto'>
          {!curUser && (
            <>
              <p className='mb-2'>
                Nhập email của bạn{' '}
                <span className='text-primary'>
                  (Email này sẽ được dùng để gửi đơn hàng sau khi mua)
                </span>
              </p>
              <Input
                id='email'
                label='Email'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type='email'
                icon={MdEmail}
                className='mb-2'
              />
            </>
          )}

          <div className='mb-2'>
            Bạn có voucher?{' '}
            <p className='text-nowrap inline'>
              (
              <button
                className='text-sky-600 hover:underline z-10'
                onClick={() => setIsShowVoucher(prev => !prev)}>
                ấn vào đây
              </button>
              )
            </p>
          </div>
          {isShowVoucher && (
            <div className='flex items-center gap-1 mb-2'>
              <Input
                id='code'
                label='Voucher'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type='text'
                icon={RiCoupon2Fill}
                className='mb-2'
              />
              <button
                className={`rounded-lg border py-2 px-4 text-nowrap flex-shrink-0 hover:bg-primary common-transition hover:text-light ${
                  isLoading
                    ? 'border-slate-200 bg-slate-200 pointer-events-none'
                    : 'border-primary text-primary '
                }`}
                onClick={handleSubmit(handleApplyVoucher)}
                disabled={isLoading}>
                {isLoading ? (
                  <RiDonutChartFill size={26} className='animate-spin text-slate-300' />
                ) : (
                  'Áp dụng'
                )}
              </button>
            </div>
          )}

          {voucherMessage && (
            <p className={`${voucher ? 'text-green-600' : 'text-rose-500'} -mt-3 mb-2`}>
              {voucherMessage}
            </p>
          )}
          <div className='flex items-center justify-between mb-2'>
            <span>Tổng tiền:</span>
            <span className='font-semibold'>{formatPrice(subTotal)}</span>
          </div>
          {voucher && (
            <div className='flex items-center justify-between'>
              <span>Voucher:</span>
              <span className='font-semibold text-yellow-400'>
                {voucher?.type === 'percentage'
                  ? `${voucher.value} (${formatPrice(calcPercentage(voucher.value, subTotal))})`
                  : formatPrice(+voucher?.value!)}
              </span>
            </div>
          )}

          <div className='pt-2' />
          <hr />
          <div className='pt-2' />

          <div className='flex items-end justify-between mb-4'>
            <span className='font-semibold text-xl'>Thành tiền:</span>
            <span className='font-semibold text-3xl text-green-600'>{formatPrice(total)}</span>
          </div>

          <div className='flex flex-col gap-3'>
            <button
              className='flex items-center justify-center rounded-xl gap-1 border border-primary py-2 px-3 group hover:bg-primary common-transition'
              onClick={() => !curUser && router.push('/')}>
              <Image src='/images/logo.jpg' height={32} width={32} alt='logo' />
              <span className='font-semibold ml-1 group-hover:text-light'>
                Mua bằng số dư ({formatPrice(curUser?.balance || 0)})
              </span>
            </button>

            <button
              className='flex items-center justify-center rounded-xl gap-2 border border-[#a1396c] py-2 px-3 group hover:bg-[#a1396c] common-transition'
              onClick={() => handleCheckout('momo')}>
              <Image
                className='group-hover:border-white rounded-md border-2'
                src='/images/momo-icon.jpg'
                height={32}
                width={32}
                alt='logo'
              />
              <span className='font-semibold group-hover:text-light'>Mua nhanh với Momo</span>
            </button>

            <button
              className='flex items-center justify-center rounded-xl gap-2 border border-[#62b866] py-2 px-3 group hover:bg-[#62b866] common-transition'
              onClick={() => handleCheckout('banking')}>
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
