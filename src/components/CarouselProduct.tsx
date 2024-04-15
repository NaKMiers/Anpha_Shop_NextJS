'use client'

import { FullyCartItem } from '@/app/api/cart/route'
import { FullyProduct } from '@/app/api/product/[slug]/route'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { addCartItem, addLocalCartItem } from '@/libs/reducers/cartReducer'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICartItem } from '@/models/CartItemModel'
import { addToCartApi } from '@/requests'
import mongoose from 'mongoose'
import { getSession, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCartPlus } from 'react-icons/fa'
import { RiDonutChartFill } from 'react-icons/ri'

interface CarouselProductProps {
  product: FullyProduct
  className?: string
}

function CarouselProduct({ product, className = '' }: CarouselProductProps) {
  // hooks
  const dispatch = useAppDispatch()
  const localCart = useAppSelector(state => state.cart.localItems)
  const router = useRouter()
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // handle add product to cart - DATABASE
  const addProductToCart = useCallback(async () => {
    // start loading
    setIsLoading(true)

    try {
      // send request to add product to cart
      const { cartItems, message, errors } = await addToCartApi([
        { productId: product._id, quantity: 1 },
      ])

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

      // add cart items to state
      dispatch(addCartItem(cartItems))
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setIsLoading(false)
    }
  }, [dispatch, product._id])

  // handle buy now (add to cart and move to cart) - DATABASE
  const buyNow = useCallback(async () => {
    // start page loading
    dispatch(setPageLoading(true))
    try {
      // send request to add product to cart
      const { cartItems, message, errors } = await addToCartApi([
        { productId: product._id, quantity: 1 },
      ])

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

      // add cart items to state
      dispatch(addCartItem(cartItems))

      // move to cart page
      router.push(`/cart?product=${product.slug}`)
    } catch (err: any) {
      console.log(err)
    } finally {
      // stop page loading
      dispatch(setPageLoading(false))
    }
  }, [product._id, dispatch, product.slug, router])

  // handle add product to cart - LOCAL
  const addProductToLocalCart = useCallback(() => {
    // add product to local cart
    // create cart item from product
    const existingCartItem = localCart.find(
      (item: ICartItem) => item.productId.toString() === product._id
    )

    // product has already existed in cart
    if (existingCartItem) {
      // if not enough products in stock
      if (existingCartItem.quantity + 1 > product.stock) {
        toast.error('Hiện không đủ sản phẩm để thêm vào giỏ hàng của bạn. Xin lỗi vì sự bất tiện này')
        return
      }

      dispatch(addLocalCartItem({ ...existingCartItem, quantity: existingCartItem.quantity + 1 }))

      // success toast
      toast.success(`Đã thêm gói "${product.title}" vào giỏ hàng`)
      return
    }

    // product has not existed in user cart
    // if not enough products in stock
    if (1 > product.stock) {
      toast.error('Hiện không đủ sản phẩm để thêm vào giỏ hàng của bạn. Xin lỗi vì sự bất tiện này')
      return
    }

    // still have enough products in stock
    // create new cart item
    const newCartItem = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      userId: curUser?._id,
      productId: product._id,
      product,
      quantity: 1,
    }

    // calculate user cart length
    // const cartLength = localCart.reduce((total, cartItem) => total + cartItem.quantity, 0) + 1

    dispatch(addLocalCartItem(newCartItem as FullyCartItem))

    // success toast
    toast.success(`Đã thêm gói "${product.title}" vào giỏ hàng`)
    return
  }, [curUser?._id, dispatch, localCart, product])

  // handle buy now (add to cart and move to cart) - LOCAL
  const buyNowLocal = useCallback(() => {
    addProductToLocalCart()

    // move to cart page
    router.push(`/cart?product=${product.slug}`)
  }, [addProductToLocalCart, product.slug, router])

  // handle add product to cart
  const handleAddToCart = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (curUser) {
        addProductToCart()
      } else {
        addProductToLocalCart()
      }
    },
    [curUser, addProductToCart, addProductToLocalCart]
  )

  // handle buy now
  const handleBuyNow = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (curUser) {
        buyNow()
      } else {
        buyNowLocal()
      }
    },
    [curUser, buyNow, buyNowLocal]
  )

  return (
    <Link
      href={`/${product.slug}`}
      prefetch={false}
      className={`aspect-video w-2/3 sm:w-1/3 lg:w-1/5 shrink-0 px-21/2 ${className}`}>
      <div className='relative rounded-small overflow-hidden group'>
        {/* Thumbnail */}
        <Image
          className='flex-shrink-0 snap-start w-full h-full object-cover block'
          src={product.images[0]}
          width={1200}
          height={768}
          alt='account'
        />

        {/* Overlay */}
        <div className='flex flex-col sm:gap-1 justify-center absolute translate-y-full opacity-0 w-full h-full top-0 left-0 bg-sky-500 bg-opacity-65 p-3 text-center transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
          <h5
            className='text-white text-sm font-body leading-4 text-ellipsis flex-shrink-0 line-clamp-2'
            title={product.title}>
            {product.title}
          </h5>
          <p className='uppercase text-xs font-semibold text-slate-200 leading-3'>
            - {product.category.title} -
          </p>
          <p className='font-bold text-white text-xs'>
            Đã bán: <span className='font-semibold text-green-200'>{product.sold}</span>
          </p>
          {/* Action Buttons */}
          <div className='flex items-center gap-2 justify-center' onClick={e => e.preventDefault()}>
            <button
              className='h-[26px] md:h-[30px] px-2 bg-secondary rounded-[4px] text-[12px] text-white font-semibold font-body tracking-wider text-nowrap hover:bg-primary common-transition'
              onClick={handleBuyNow}
              disabled={isLoading}>
              MUA NGAY
            </button>
            <button
              className={`h-[26px] md:h-[30px] px-2 bg-primary rounded-[4px] hover:bg-primary-600 common-transition hover:bg-secondary ${
                isLoading ? 'pointer-events-none bg-slate-200' : ''
              }`}
              onClick={handleAddToCart}
              disabled={isLoading}>
              {isLoading ? (
                <RiDonutChartFill size={13} className='animate-spin text-white' />
              ) : (
                <FaCartPlus size={16} className='text-white wiggle-1' />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CarouselProduct
