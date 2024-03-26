'use client'

import Image from 'next/image'
import { FaCartPlus } from 'react-icons/fa'
import { FaCircleCheck } from 'react-icons/fa6'
import Price from './Price'
import Link from 'next/link'
import { IProduct } from '@/models/ProductModel'
import { countPercent } from '@/utils/formatNumber'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { addCartItem } from '@/libs/reducers/cartReducer'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { RiDonutChartFill } from 'react-icons/ri'
import { setLoading, setPageLoading } from '@/libs/reducers/modalReducer'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  product: IProduct
  className?: string
}

function ProductCard({ product, className = '' }: ProductCardProps) {
  // hook
  const dispatch = useAppDispatch()
  const router = useRouter()

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // handle add product to cart
  const handleAddProductToCart = useCallback(async () => {
    // start loading
    setIsLoading(true)

    try {
      // send request to add product to cart
      const res = await axios.post('/api/cart/add', { productId: product._id, quantity: 1 })
      const { cartItem, message } = res.data

      // add cart item to state
      dispatch(addCartItem(cartItem))

      // show toast success
      toast.success(message)
    } catch (err: any) {
      console.log(err.message)
      toast.error(err.response.data.message)
    } finally {
      // stop loading
      setIsLoading(false)
    }
  }, [dispatch, product._id])

  // handle buy now (add to cart and move to cart)
  const handleBuyNow = useCallback(async () => {
    // start page loading
    dispatch(setPageLoading(true))
    try {
      // send request to add product to cart
      const res = await axios.post('/api/cart/add', { productId: product._id, quantity: 1 })
      const { cartItem, message } = res.data

      // add cart item to state
      dispatch(addCartItem(cartItem))

      // show toast success
      toast.success(message)

      // move to cart page
      router.push(`/cart?product=${product.slug}`)
    } catch (err: any) {
      console.log(err.message)
    } finally {
      // stop page loading
      dispatch(setPageLoading(false))
    }
  }, [product._id, dispatch, product.slug, router])

  return (
    <div
      className={`relative w-full p-4 bg-white shadow-lg rounded-xl select-none hover:-translate-y-1 transition duration-500 ${className}`}>
      <Link
        href={`/${product.slug}`}
        className='aspect-video rounded-lg overflow-hidden shadow-lg block'>
        <div className='flex w-full overflow-x-scroll snap-x no-scrollbar'>
          {product.images.map(src => (
            <Image
              className='flex-shrink snap-start'
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
      {product.oldPrice && (
        <div className='absolute -top-2 -left-2 rounded-tl-lg rounded-br-lg bg-yellow-400 p-1 max-w-10 text-light font-semibold font-body text-center text-[13px] leading-4'>
          Giảm {countPercent(product.price, product.oldPrice)}
        </div>
      )}

      <Link href={`/${product.slug}`}>
        <h3
          className='font-body text-[18px] text-dark tracking-wide leading-[22px] my-3'
          title={product.title}>
          {product.title}
        </h3>
      </Link>

      <Price price={product.price} oldPrice={product.oldPrice} className='mb-2' />

      <div className='flex items-center font-body tracking-wide'>
        <FaCircleCheck size={16} className='text-darker' />
        <span className='font-bold text-darker ml-1'>Đã bán:</span>
        <span className='text-red-500 ml-1'>{product.sold}</span>
      </div>

      <div className='flex items-center justify-end md:justify-start gap-2 mt-2'>
        <button
          className='bg-secondary rounded-md text-white px-2 py-1 font-semibold font-body tracking-wider text-nowrap hover:bg-primary common-transition'
          onClick={handleBuyNow}
          disabled={isLoading}>
          MUA NGAY
        </button>
        <button
          className={`bg-primary rounded-md p-2 group hover:bg-primary-600 common-transition ${
            isLoading ? 'pointer-events-none bg-slate-200' : ''
          }`}
          onClick={handleAddProductToCart}
          disabled={isLoading}>
          {isLoading ? (
            <RiDonutChartFill size={18} className='animate-spin text-white' />
          ) : (
            <FaCartPlus size={18} className='text-white group-hover:scale-110 common-transition' />
          )}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
