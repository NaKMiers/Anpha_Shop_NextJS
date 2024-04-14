'use client'

import { FullyCartItem } from '@/app/api/cart/route'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { addCartItem, addLocalCartItem } from '@/libs/reducers/cartReducer'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICartItem } from '@/models/CartItemModel'
import { IProduct } from '@/models/ProductModel'
import { addToCartApi } from '@/requests'
import { applyFlashSalePrice, countPercent } from '@/utils/number'
import mongoose from 'mongoose'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCartPlus } from 'react-icons/fa'
import { FaCircleCheck } from 'react-icons/fa6'
import { RiDonutChartFill } from 'react-icons/ri'
import Price from './Price'
import { FullyProduct } from '@/app/api/product/[slug]/route'

interface ProductCardProps {
  product: FullyProduct
  className?: string
}

function ProductCard({ product, className = '' }: ProductCardProps) {
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

      console.log(cartItems)

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

      console.log(cartItems)

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

    // add new cart item to local cart
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
    <div
      className={`relative w-full h-full min-h-[430px] p-4 bg-white shadow-lg rounded-xl hover:-translate-y-1 transition duration-500 ${className}`}>
      {/* Sold out */}
      {product.stock <= 0 && (
        <Link
          href={`/${product.slug}`}
          className='absolute z-10 top-4 left-4 right-4 flex justify-center items-start aspect-video bg-white rounded-lg bg-opacity-50'>
          <Image
            className='animate-wiggle -mt-1'
            src='/images/sold-out.jpg'
            width={60}
            height={60}
            alt='sold-out'
          />
        </Link>
      )}

      {/* Thumbnails */}
      <Link
        href={`/${product.slug}`}
        className='relative aspect-video rounded-lg overflow-hidden shadow-lg block'>
        <div className='flex w-full overflow-x-scroll snap-x snap-mandatory'>
          {product.images.map(src => (
            <Image
              className='flex-shrink-0 snap-start w-full h-full object-cover'
              src={src}
              width={250}
              height={250}
              alt='netflix'
              key={src}
            />
          ))}
        </div>
      </Link>

      {/* Badge */}
      {product.oldPrice && product.stock > 0 && (
        <div className='absolute z-10 -top-2 -left-2 rounded-tl-lg rounded-br-lg bg-yellow-400 p-1 max-w-10 text-light font-semibold font-body text-center text-[13px] leading-4'>
          Giảm {countPercent(applyFlashSalePrice(product.flashsale, product.price), product.oldPrice)}
        </div>
      )}

      {/* Title */}
      <Link href={`/${product.slug}`}>
        <h3
          className='font-body text-[18px] text-dark tracking-wide leading-[22px] my-3'
          title={product.title}>
          {product.title}
        </h3>
      </Link>

      {/* Price */}
      <Price
        price={product.price}
        oldPrice={product.oldPrice}
        flashSale={product.flashsale}
        stock={product.stock}
        className='mb-2'
      />

      {/* Basic Information */}
      <div className='flex items-center font-body tracking-wide'>
        <FaCircleCheck size={16} className='text-darker' />
        <span className='font-bold text-darker ml-1'>Đã bán:</span>
        <span className='text-red-500 ml-1'>{product.sold}</span>
      </div>

      {/* Action Buttons */}
      <div className='flex items-center justify-end md:justify-start gap-2 mt-2'>
        <button
          className={`bg-secondary rounded-md text-white px-2 py-1 font-semibold font-body tracking-wider text-nowrap hover:bg-primary common-transition ${
            product.stock <= 0 ? 'bg-slate-200 pointer-events-none' : ''
          }`}
          onClick={handleBuyNow}
          disabled={isLoading || product.stock <= 0}>
          MUA NGAY
        </button>
        <button
          className={`bg-primary rounded-md py-2 px-3 group hover:bg-primary-600 hover:bg-secondary common-transition ${
            isLoading || product.stock <= 0 ? 'pointer-events-none bg-slate-200' : ''
          }`}
          onClick={handleAddToCart}
          disabled={isLoading || product.stock <= 0}>
          {isLoading ? (
            <RiDonutChartFill size={18} className='animate-spin text-white' />
          ) : (
            <FaCartPlus size={18} className='text-white wiggle' />
          )}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
