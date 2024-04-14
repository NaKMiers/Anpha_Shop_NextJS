'use client'

import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { addCartItem } from '@/libs/reducers/cartReducer'
import { setLoading, setPageLoading } from '@/libs/reducers/modalReducer'
import { IProduct } from '@/models/ProductModel'
import { addToCartApi } from '@/requests'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCartPlus, FaMinus, FaPlus } from 'react-icons/fa'
import { RiDonutChartFill } from 'react-icons/ri'

interface BuyActionWithQuantityProps {
  product: IProduct | null
  className?: string
}

function BuyActionWithQuantity({ product, className = '' }: BuyActionWithQuantityProps) {
  // hooks
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  const router = useRouter()

  // states
  const [quantity, setQuantity] = useState<number>(product && product.stock > 0 ? 1 : 0)

  // handle add product to cart
  const handleAddProductToCart = useCallback(async () => {
    if (product) {
      // start loading
      dispatch(setLoading(true))

      try {
        // send request to add product to cart
        const { cartItems, message, errors } = await addToCartApi([{ productId: product._id, quantity }])

        // show toast success
        toast.success(message)
        if (errors.notEnough) {
          toast.error(errors.notEnough)
        }
        if (errors.notFound) {
          toast.error(errors.notFound)
        }

        // add cart item to state
        dispatch(addCartItem(cartItems))
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        dispatch(setLoading(false))
      }
    }
  }, [dispatch, product, quantity])

  // handle buy now (add to cart and move to cart)
  const handleBuyNow = useCallback(async () => {
    if (product) {
      // start page loading
      dispatch(setPageLoading(true))

      try {
        // send request to add product to cart
        const { cartItems, message, errors } = await addToCartApi([{ productId: product._id, quantity }])

        // show toast success
        toast.success(message)
        if (errors.notEnough) {
          toast.error(errors.notEnough)
        }
        if (errors.notFound) {
          toast.error(errors.notFound)
        }

        // add cart item to state
        dispatch(addCartItem(cartItems))

        // move to cart page
        router.push(`/cart?product=${product?.slug}`)
      } catch (err: any) {
        console.log(err)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
  }, [product, dispatch, quantity, router])

  // handle quantity
  const handleQuantity = useCallback(
    (value: number, isCustom: boolean = false) => {
      if (!isCustom) {
        // quantity must be > 0
        if (quantity + value <= 0) return

        // quantity must be <= product stock
        if (quantity + value > product?.stock!) return

        setQuantity(quantity + value)
      } else {
        // quantity must be > 0
        if (value < 1) value = 1

        // quantity must be <= product stock
        if (value > product?.stock!) value = product?.stock!

        setQuantity(value)
      }
    },
    [product?.stock, quantity]
  )

  return (
    <>
      {/* Quantity */}
      <div className={`select-none inline-flex rounded-md overflow-hidden my-3 ${className}`}>
        <button
          className={`group flex items-center justify-center px-3 py-[10px] group rounded-tl-md rounded-bl-md hover:bg-secondary border common-transition ${
            quantity <= 1
              ? 'pointer-events-none border-slate-100 bg-slate-100'
              : 'border border-secondary'
          }`}
          disabled={quantity <= 1 || isLoading || (product?.stock || 0) <= 0}
          onClick={() => handleQuantity(-1)}>
          <FaMinus
            size={16}
            className={`group-hover:text-white wiggle ${
              quantity <= 1 ? 'text-slate-300' : 'text-secondary'
            }`}
          />
        </button>
        <input
          className='max-w-14 px-2 border-y border-slate-100 outline-none text-center text-lg text-dark font-semibold font-body'
          type='text'
          inputMode='numeric'
          value={quantity}
          disabled={isLoading || (product?.stock || 0) <= 0}
          onChange={e => setQuantity(+e.target.value || 0)}
          onBlur={e => handleQuantity(+e.target.value, true)}
        />
        <button
          className={`group flex items-center justify-center px-3 py-[10px] group rounded-tr-md rounded-br-md hover:bg-secondary border common-transition ${
            quantity >= product?.stock!
              ? 'pointer-events-none border-slate-100 bg-slate-100'
              : ' border-secondary'
          }`}
          disabled={quantity === product?.stock || isLoading || (product?.stock || 0) <= 0}
          onClick={() => handleQuantity(1)}>
          <FaPlus
            size={16}
            className={`group-hover:text-white wiggle ${
              quantity >= product?.stock! ? 'text-slate-300' : 'text-secondary'
            }`}
          />
        </button>
      </div>

      {/* Action Buttons */}
      <div className='flex items-center flex-row-reverse md:flex-row justify-start gap-3 mt-2'>
        <button
          className={`bg-secondary rounded-md text-white text-xl px-3 py-[5px] font-semibold font-body hover:bg-primary common-transition  ${
            isLoading || (product?.stock || 0) <= 0 ? 'pointer-events-none bg-slate-200' : ''
          }`}
          onClick={handleBuyNow}
          disabled={isLoading || (product?.stock || 0) <= 0}>
          MUA NGAY
        </button>
        <button
          className={`bg-primary rounded-md py-2 px-3 group hover:bg-primary-600 common-transition ${
            isLoading || (product?.stock || 0) <= 0 ? 'pointer-events-none bg-slate-200' : ''
          }`}
          onClick={handleAddProductToCart}
          disabled={isLoading || (product?.stock || 0) <= 0}>
          {isLoading ? (
            <RiDonutChartFill size={22} className='animate-spin text-white' />
          ) : (
            <FaCartPlus size={22} className='text-white wiggle' />
          )}
        </button>
      </div>
    </>
  )
}

export default BuyActionWithQuantity
