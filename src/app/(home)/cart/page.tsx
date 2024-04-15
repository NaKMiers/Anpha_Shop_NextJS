'use client'

import { FullyCartItem } from '@/app/api/cart/route'
import { FullyProduct } from '@/app/api/product/[slug]/route'
import CartItem from '@/components/CartItem'
import Input from '@/components/Input'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import {
  addCartItem,
  deleteLocalCartItem,
  setCartItems,
  setLocalCartItems,
  setSelectedItems,
} from '@/libs/reducers/cartReducer'
import { setLoading, setPageLoading } from '@/libs/reducers/modalReducer'
import { IVoucher } from '@/models/VoucherModel'
import {
  addToCartApi,
  applyVoucherApi,
  createOrderApi,
  generateOrderCodeApi,
  updateProductsInLocalCartApi,
} from '@/requests'
import { applyFlashSalePrice, calcPercentage, formatPrice } from '@/utils/number'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaArrowCircleDown, FaPlusSquare } from 'react-icons/fa'
import { FaCartShopping } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import { RiCoupon2Fill, RiDonutChartFill } from 'react-icons/ri'

function CartPage() {
  // hooks
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  let localCartItems = useAppSelector(state => state.cart.localItems)
  let cartItems = useAppSelector(state => state.cart.items)
  const selectedItems = useAppSelector(state => state.cart.selectedItems)
  const router = useRouter()
  const queryParams = useSearchParams()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [voucher, setVoucher] = useState<IVoucher | null>(null)
  const [voucherMessage, setVoucherMessage] = useState<string>('')
  const [subTotal, setSubTotal] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const [cartLength, setCartlength] = useState(0)

  const [items, setItems] = useState<FullyCartItem[]>([])
  const [localItems, setLocalItems] = useState<FullyCartItem[]>([])

  // loading and showing
  const [isShowVoucher, setIsShowVoucher] = useState<boolean>(false)
  const [isBuying, setIsBuying] = useState<boolean>(false)
  const [isLocalCartUpdated, setIsLocalCartUpdated] = useState<boolean>(false)

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

  // update products in local cart
  useEffect(() => {
    const getCorrespondingProducts = async () => {
      console.log('getCorrespondingProducts')
      try {
        // send product ids to get corresponding cart items
        const { products } = await updateProductsInLocalCartApi(
          localCartItems.map(item => item.product._id)
        )

        const updatedLocalCartItems = localCartItems
          .map(cartItem => {
            const product = products.find(
              (product: FullyProduct) => product._id === cartItem.product._id
            )

            return product
              ? {
                  ...cartItem,
                  product,
                }
              : null
          })
          .filter(cartItem => cartItem) as FullyCartItem[]

        dispatch(setLocalCartItems(updatedLocalCartItems))
        setIsLocalCartUpdated(true)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      }
    }

    if (!curUser?._id && !isLocalCartUpdated) {
      getCorrespondingProducts()
    }
  }, [curUser?._id, dispatch, localCartItems, isLocalCartUpdated])

  // get cart length
  useEffect(() => {
    // stop page loading
    dispatch(setPageLoading(false))

    if (curUser) {
      setCartlength(cartItems.reduce((total, item) => total + item.quantity, 0))
      setItems(cartItems)
      setLocalItems(localCartItems)
    } else {
      setCartlength(localCartItems.reduce((total, item) => total + item.quantity, 0))
      setItems(localCartItems)
    }
  }, [cartItems, localCartItems, curUser, dispatch])

  // calc total, discount, subTotal
  useEffect(() => {
    const subTotal = selectedItems.reduce((total, cartItem) => {
      const item: any = items.find(cI => cI._id === cartItem._id)

      return (
        total +
        (item?.quantity ?? 0) * (applyFlashSalePrice(item?.product.flashsale, item?.product.price) ?? 0)
      )
    }, 0)
    setSubTotal(subTotal)

    let finalTotal = subTotal
    let discount = 0
    if (voucher) {
      if (voucher.type === 'fixed-reduce') {
        discount = +voucher.value
        finalTotal = subTotal + discount
      } else if (voucher.type === 'fixed') {
        discount = +voucher.value
        finalTotal = discount
      } else if (voucher.type === 'percentage') {
        discount = +calcPercentage(voucher.value, subTotal)
        finalTotal = subTotal + discount
      }
    }
    setDiscount(discount)
    setTotal(finalTotal)
  }, [selectedItems, voucher, items])

  // send request to server to check voucher
  const handleApplyVoucher: SubmitHandler<FieldValues> = useCallback(
    async data => {
      if (selectedItems.length) {
        // start loading
        dispatch(setLoading(true))

        try {
          // send request to server
          const { voucher, message } = await applyVoucherApi(data.code, data.email, subTotal)

          // set voucher to state
          setVoucher(voucher)
          setVoucherMessage(message)

          // show success message
          toast.success(message)
        } catch (err: any) {
          console.log(err)
          const { message } = err
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
    [dispatch, selectedItems.length, subTotal]
  )

  // validate before checkout
  const handleValidateBeforeCheckout = useCallback(() => {
    let isValid = true
    if (!selectedItems.length) {
      toast.error('Hãy chọn sản phẩm để tiến hành thanh toán')
      isValid = false
    }

    if (!curUser && !getValues('email')) {
      setError('email', { message: 'Email không được để trống' })
      isValid = false
    }

    return isValid
  }, [curUser, getValues, selectedItems.length, setError])

  // handle checkout
  const handleCheckout = useCallback(
    async (type: string) => {
      // validate before checkout
      if (!handleValidateBeforeCheckout()) return

      // start page loading
      dispatch(setPageLoading(true))

      // generate order code
      try {
        const { orderCode } = await generateOrderCodeApi() // cache: no-store

        // create checkout
        const checkout = {
          selectedItems,
          code: orderCode,
          email: curUser?.email || getValues('email'),
          voucher,
          discount,
          total,
        }
        localStorage.setItem('checkout', JSON.stringify(checkout))

        // move to checkout page
        router.push(`/checkout/${type}`)
      } catch (err: any) {
        console.log(err)
      }
    },
    [
      curUser?.email,
      dispatch,
      getValues,
      handleValidateBeforeCheckout,
      router,
      selectedItems,
      voucher,
      discount,
      total,
    ]
  )

  // handle buy with balance
  const handleBuyWithBalance = useCallback(async () => {
    // check user
    if (!curUser) {
      toast.error('Hãy đăng nhập để thực hiện chức năng này')
      return
    }

    // validate before checkout
    if (!handleValidateBeforeCheckout()) return

    // start loading
    setIsBuying(true)

    try {
      const { orderCode } = await generateOrderCodeApi() // cache: no-store

      const items = selectedItems.map((cartItem: FullyCartItem) => ({
        _id: cartItem._id,
        product: cartItem.product,
        quantity: cartItem.quantity,
      })) as FullyCartItem[]

      // send request to server to create order
      const { removedCartItems, message } = await createOrderApi(
        orderCode,
        curUser.email,
        total,
        voucher?._id,
        discount,
        items,
        'balance'
      )

      // remove cart items in store
      dispatch(setCartItems(items.filter(item => !removedCartItems.includes(item._id))))

      // show success message
      toast.success(message)

      // redirect to order history page
      router.push('/user/order-history')
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setIsBuying(false)
    }
  }, [
    curUser,
    dispatch,
    handleValidateBeforeCheckout,
    router,
    selectedItems,
    total,
    voucher?._id,
    discount,
  ])

  // move all local items to global items
  const handleMoveAllLocalToGlobalCartItem = useCallback(async () => {
    // start loading
    dispatch(setLoading(true))

    try {
      // send request to add product to cart
      const { cartItems, message, errors } = await addToCartApi(
        localItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      )

      // show toast success
      if (message) {
        toast.success(message)
      }
      if (errors.notEnough) {
        toast.error(errors.notEnough)
      }
      if (errors.notFound) {
        toast.error(errors.notFound)
      }

      // add cart item to state
      dispatch(addCartItem(cartItems))

      // delete local cart item
      dispatch(setLocalCartItems([]))
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      dispatch(setLoading(false))
    }
  }, [dispatch, localItems])

  return (
    <div className='mt-20 grid grid-cols-1 md:grid-cols-3 gap-21 bg-white rounded-medium shadow-medium p-8 pb-16 text-dark'>
      {/* Cart Items */}
      <div className='col-span-1 md:col-span-2'>
        <h1 className='flex items-center gap-2 font-semibold font-body text-3xl'>
          <FaCartShopping size={30} className='text-dark wiggle' />
          <span>Giỏ hàng</span>
          <span>
            (<span className='text-primary font-normal'>{cartLength}</span>)
          </span>
        </h1>

        <div className='pt-6' />

        {/* Local cart items */}
        {!!localItems.length && curUser && (
          <div className='border border-slate-400 rounded-medium p-3'>
            <p className='text-primary italic mb-3'>
              Có một số sản phẩm hiện đang tồn tại trên máy của bạn, bấm vào nút{' '}
              <FaPlusSquare size={19} className='inline-block wiggle' /> bên dưới để thêm vào giỏ hàng.
            </p>

            <div
              className='flex justify-center items-center gap-2 group cursor-pointer bg-dark-200 mb-4 text-white rounded-lg p-1 hover:bg-primary common-transition'
              onClick={handleMoveAllLocalToGlobalCartItem}>
              <span>Thêm tất cả</span>
              <FaArrowCircleDown size={21} className='inline-block wiggle-0' />
            </div>

            <div className='max-h-[386px] overflow-y-auto '>
              {localItems.map((cartItem, index) => (
                <CartItem
                  cartItem={cartItem}
                  className={index != 0 ? 'mt-4' : ''}
                  key={index}
                  localCartItem
                />
              ))}
            </div>
          </div>
        )}

        <div className='pt-4' />

        {/* Checkbox All */}
        {items.length ? (
          <div>
            <div className='flex items-center justify-end gap-2 pr-21 select-none'>
              <label htmlFor='selectAll' className='font-semibold cursor-pointer '>
                {items.length === selectedItems.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </label>
              <input
                name='selectAll'
                id='selectAll'
                type='checkbox'
                checked={items.length === selectedItems.length}
                onChange={() =>
                  items.length === selectedItems.length
                    ? dispatch(setSelectedItems([]))
                    : dispatch(setSelectedItems(items))
                }
                className='size-5 accent-primary   cursor-pointer'
              />
            </div>

            <div className='pt-4' />

            {items.map((cartItem, index) => (
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
          <div
            className={`flex items-center gap-1 mb-2 overflow-hidden common-transition ${
              isShowVoucher ? 'max-h-[200px]' : 'max-h-0'
            }`}>
            <Input
              id='code'
              label='Voucher'
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              type='text'
              icon={RiCoupon2Fill}
              className='w-full'
            />
            <button
              className={`rounded-lg border py-2 px-2 text-[14px] text-nowrap h-[46px] flex-shrink-0 hover:bg-primary common-transition hover:text-light ${
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

          {voucherMessage && (
            <p className={`${voucher ? 'text-green-500' : 'text-rose-500'} mb-2`}>{voucherMessage}</p>
          )}
          <div className='flex items-center justify-between mb-2 gap-3'>
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

          <div className='flex items-end justify-between mb-4 gap-x-3'>
            <span className='font-semibold text-xl'>Thành tiền:</span>
            <span className='font-semibold text-3xl text-green-500'>{formatPrice(total)}</span>
          </div>

          <div className='flex flex-col gap-3 select-none'>
            <button
              className={`flex items-center justify-center rounded-xl gap-1 border py-2 px-3 group border-primary hover:bg-primary common-transition ${
                isBuying ? 'pointer-events-none' : ''
              }`}
              disabled={isBuying || isLoading}
              onClick={handleBuyWithBalance}>
              {isBuying ? (
                <RiDonutChartFill size={32} className='animate-spin text-slate-200' />
              ) : (
                <Image className='wiggle-0' src='/images/logo.jpg' height={32} width={32} alt='logo' />
              )}
              <span className='font-semibold ml-1 group-hover:text-light'>
                Mua bằng số dư {curUser?._id ? `(${formatPrice(curUser.balance || 0)})` : ''}
              </span>
            </button>

            <button
              className={`flex items-center justify-center rounded-xl gap-2 border border-[#a1396c] py-2 px-3 group hover:bg-[#a1396c] common-transition ${
                isBuying || isLoading ? 'pointer-events-none' : ''
              }`}
              onClick={() => handleCheckout('momo')}
              disabled={isBuying || isLoading}>
              <Image
                className='group-hover:border-white rounded-md border-2 wiggle-0'
                src='/images/momo-icon.jpg'
                height={32}
                width={32}
                alt='logo'
              />
              <span className='font-semibold group-hover:text-light'>Mua nhanh với Momo</span>
            </button>

            <button
              className={`flex items-center justify-center rounded-xl gap-2 border border-[#62b866] py-2 px-3 group hover:bg-[#62b866] common-transition ${
                isBuying || isLoading ? 'pointer-events-none' : ''
              }`}
              onClick={() => handleCheckout('banking')}
              disabled={isBuying || isLoading}>
              <Image
                className='wiggle-0'
                src='/images/banking-icon.jpg'
                height={32}
                width={32}
                alt='logo'
              />
              <span className='font-semibold group-hover:text-light'>Mua ngay với BANKING</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
