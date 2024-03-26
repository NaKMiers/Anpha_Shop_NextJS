'use client'

import { FullyProduct } from '@/app/api/product/[slug]/route'
import { useAppDispatch } from '@/libs/hooks'
import { addCartItem } from '@/libs/reducers/cartReducer'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCartPlus } from 'react-icons/fa'
import { RiDonutChartFill } from 'react-icons/ri'

interface CarouselProductProps {
  product: FullyProduct
  className?: string
}

function CarouselProduct({ product, className = '' }: CarouselProductProps) {
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
    <Link
      href={`/${product.slug}`}
      className={`aspect-video w-2/3 sm:w-1/3 lg:w-1/5 shrink-0 px-21/2 ${className}`}>
      <div className='relative rounded-small overflow-hidden group'>
        <Image src={product.images[0]} width={1200} height={768} alt='account' />
        <div className='flex flex-col sm:gap-1 justify-center absolute w-full h-full top-0 left-0 bg-sky-500 bg-opacity-60 p-2 text-center translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
          <h5 className='text-white font-body text-sm' title={product.title}>
            {product.title}
          </h5>
          <p className='uppercase text-xs font-semibold text-slate-200'>- {product.category.title} -</p>
          <p className='font-bold text-white text-sm'>
            Đã bán: <span className='font-semibold text-green-200'>{product.sold}</span>
          </p>
          <div className='flex items-center gap-2 h-[26px] justify-center'>
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
                <RiDonutChartFill size={16} className='animate-spin text-white' />
              ) : (
                <FaCartPlus size={16} className='text-white group-hover:scale-110 common-transition' />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CarouselProduct
