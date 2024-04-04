import { FullyCartItem } from '@/app/api/cart/route'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import {
  addCartItem,
  cart,
  deleteCartItem,
  deleteLocalCartItem,
  setSelectedItems,
  updateCartItemQuantity,
  updateLocalCartItemQuantity,
} from '@/libs/reducers/cartReducer'
import { formatPrice } from '@/utils/formatNumber'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaHashtag, FaMinus, FaPlus, FaPlusSquare, FaTrashAlt } from 'react-icons/fa'
import { TbPackages } from 'react-icons/tb'
import Price from './Price'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from './ConfirmDialog'
import { useSession } from 'next-auth/react'

interface CartItemProps {
  cartItem: FullyCartItem
  localCartItem?: boolean
  className?: string
  isCheckout?: boolean
  isOrderDetailProduct?: boolean
}

function CartItem({
  cartItem,
  localCartItem,
  isCheckout,
  className = '',
  isOrderDetailProduct,
}: CartItemProps) {
  // hook
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const curUser: any = session?.user
  const selectedCartItems = useAppSelector(state => state.cart.selectedItems)

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const quantity =
    cartItem.quantity > cartItem.product.stock ? cartItem.product.stock : cartItem.quantity

  // handle quantity
  const handleValidateQuantity = useCallback(
    (value: number, isCustom: boolean) => {
      let isValid: boolean = true
      let qty = quantity

      if (!isCustom) {
        // quantity must be > 0
        if (quantity + value <= 0) {
          isValid = false
        }

        // quantity must be <= product stock
        if (quantity + value > cartItem.product?.stock!) {
          isValid = false
        }

        qty = quantity + value
      } else {
        // quantity must be > 0
        if (value < 1) {
          isValid = false
        }

        // quantity must be <= product stock
        if (value > cartItem.product?.stock!) {
          isValid = false
        }

        qty = value
      }

      return { isValid, quantity: qty }
    },
    [cartItem.product?.stock, quantity]
  )

  // handle update cart quantity
  const handleUpdateCartQuantity = useCallback(
    async (value: number, isCustom: boolean = false) => {
      // validate quantity
      const { isValid, quantity } = handleValidateQuantity(value, isCustom)
      if (!isValid) return

      // start loading
      setIsLoading(true)
      try {
        // send request to update cart quantity
        const res = await axios.patch(`/api/cart/${cartItem._id}/set-quantity`, { quantity })
        const { updatedCartItem, message } = res.data

        // update cart item in store
        dispatch(updateCartItemQuantity({ id: updatedCartItem._id, quantity: updatedCartItem.quantity }))
      } catch (err: any) {
        console.log(err.message)
        toast.error(err.response.data.message)
      } finally {
        // stop loading
        setIsLoading(false)
      }
    },
    [handleValidateQuantity, cartItem._id, dispatch]
  )

  // handle update cart quantity LOCAL
  const handleUpdateLocalCartQuantity = useCallback(
    (value: number, isCustom: boolean = false) => {
      // validate quantity
      const { isValid, quantity } = handleValidateQuantity(value, isCustom)
      if (!isValid) return

      dispatch(updateLocalCartItemQuantity({ id: cartItem._id, quantity: quantity }))
    },
    [cartItem._id, dispatch, handleValidateQuantity]
  )

  // handle delete cart item
  const handleDeleteCartItem = useCallback(async () => {
    // start deleting
    setIsDeleting(true)

    try {
      const res = await axios.delete(`/api/cart/${cartItem._id}/delete`)
      const { deletedCartItem, message } = res.data

      dispatch(deleteCartItem(deletedCartItem._id))

      // show toast success
      toast.success(message)
    } catch (err: any) {
      console.log(err.message)
      toast.error(err.response.cartItem.message)
    } finally {
      // stop deleting
      setIsDeleting(false)
      setIsOpenConfirmModal(false)
    }
  }, [dispatch, cartItem._id])

  // handle delete LOCAL cart item
  const handleDeleteLocalCartItem = useCallback(() => {
    dispatch(deleteLocalCartItem(cartItem._id))
  }, [cartItem._id, dispatch])

  // handle move local cart item to global cart
  const handleMoveLocalToGlobalCartItem = useCallback(async () => {
    // add to database cart
    // handle add product to cart - DATABASE
    setIsLoading(true)

    try {
      // send request to add product to cart
      const res = await axios.post('/api/cart/add', {
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      })
      const { cartItem: cI, message } = res.data

      // add cart item to state
      dispatch(addCartItem(cI))

      // show toast success
      toast.success(message)
    } catch (err: any) {
      console.log(err.message)
      toast.error(err.response.data.message)
    } finally {
      // stop loading
      setIsLoading(false)
    }

    // delete local cart item
    handleDeleteLocalCartItem()
  }, [handleDeleteLocalCartItem, cartItem.productId, dispatch, setIsLoading, cartItem.quantity])

  return (
    <div
      className={`relative flex flex-wrap md:flex-nowrap items-start gap-3 ${className} ${
        localCartItem ? '' : 'rounded-medium border border-slate-400 p-21'
      }`}>
      <Link
        href={`/${cartItem.product.slug}`}
        className='aspect-video rounded-lg overflow-hidden shadow-lg block max-w-[150px]'>
        <div className='flex w-full overflow-x-scroll snap-x no-scrollbar'>
          {cartItem.product.images.map(src => (
            <Image
              className='flex-shrink w-full snap-start'
              src={src}
              width={150}
              height={150}
              alt='netflix'
              key={src}
            />
          ))}
        </div>
      </Link>

      {/* Local action buttons */}
      {localCartItem && !isCheckout && (
        <div className='absolute z-10 top-1 right-4  flex flex-col gap-2'>
          {isLoading ? (
            <RiDonutChartFill size={24} className='animate-spin text-slate-300' />
          ) : (
            <FaPlusSquare // add to database cart
              size={21}
              className='text-primary cursor-pointer hover:scale-110 common-transition'
              onClick={handleMoveLocalToGlobalCartItem}
            />
          )}

          <FaTrashAlt // delete
            size={21}
            className='text-secondary cursor-pointer hover:scale-110 common-transition'
            onClick={handleDeleteLocalCartItem}
          />
        </div>
      )}

      {/* Checkbox */}
      {!localCartItem && (
        <input
          type='checkbox'
          className='size-5 z-10 cursor-pointer absolute top-21 right-21'
          checked={!!selectedCartItems.find(cI => cI._id === cartItem._id)}
          onChange={() =>
            dispatch(
              setSelectedItems(
                selectedCartItems.find(cI => cI._id === cartItem._id)
                  ? selectedCartItems.filter(cI => cI._id !== cartItem._id)
                  : [...selectedCartItems, cartItem]
              )
            )
          }
        />
      )}

      {/* Info */}
      <div className={`relative w-full h-full ${localCartItem && !isCheckout ? 'pr-10' : ''}`}>
        <Link href='/netflix'>
          <h2 className={`text-[20px] tracking-wide mb-2 leading-6 pr-8`} title={cartItem.product.title}>
            {cartItem.product.title}
          </h2>
        </Link>

        {isOrderDetailProduct && (
          <div className='flex justify-between'>
            {/* (Order Detail) Quantity */}
            <div className='flex items-center gap-1 text-[16px]'>
              <FaHashtag className='text-darker' size={16} />
              <span className='text-darker font-bold text-nowrap'>Số lượng:</span>
              <span className='text-green-600'>{cartItem.quantity}</span>
            </div>

            {/* (Order Detail) Price */}
            <div className='flex items-center gap-1 text-[16px]'>
              <FaHashtag className='text-darker' size={16} />
              <span className='text-darker font-bold text-nowrap'>Giá:</span>
              <span className='text-green-600'>{formatPrice(cartItem.product.price)}</span>
            </div>
          </div>
        )}

        {localCartItem ? (
          !isOrderDetailProduct && (
            <div className='flex flex-col gap-3 text-xl font-body tracking-wide'>
              {/* Quantity */}
              <div className='flex items-center gap-1 text-[16px]'>
                <FaHashtag className='text-darker' size={16} />
                <span className='text-darker font-bold text-nowrap'>Số lượng:</span>
                <span className='text-green-600'>{cartItem.quantity}</span>
              </div>
            </div>
          )
        ) : (
          <>
            {/* Price & Stock */}
            <Price price={cartItem.product.price} oldPrice={cartItem.product.oldPrice} />
            <div className='flex items-center gap-1 mt-2 text-[16px]'>
              <TbPackages className='text-darker' size={22} />
              <span className='text-darker font-bold text-nowrap font-body tracking-wide'>Còn lại:</span>
              <span className='text-green-600'>{cartItem.product.stock}</span>
            </div>
          </>
        )}

        {/* Quantity */}
        {!localCartItem && (
          <div className='flex items-center justify-between'>
            <div className={`select-none inline-flex rounded-md overflow-hidden my-3 ${className}`}>
              <button
                className={`flex items-center justify-center px-3 py-[10px] group rounded-tl-md rounded-bl-md hover:bg-secondary border common-transition ${
                  quantity <= 1 || isLoading
                    ? 'pointer-events-none border-slate-100 bg-slate-100'
                    : 'border border-secondary'
                }`}
                disabled={quantity <= 1 || isLoading}
                onClick={() =>
                  curUser ? handleUpdateCartQuantity(-1) : handleUpdateLocalCartQuantity(-1)
                }>
                {isLoading ? (
                  <RiDonutChartFill size={16} className='animate-spin text-slate-300' />
                ) : (
                  <FaMinus
                    size={16}
                    className={`group-hover:text-white group-hover:scale-110 common-transition ${
                      quantity <= 1 || isLoading ? 'text-slate-300' : 'text-secondary'
                    }`}
                  />
                )}
              </button>
              <input
                className='max-w-14 px-2 border-y border-slate-100 outline-none text-center text-lg text-dark font-semibold font-body'
                type='text'
                inputMode='numeric'
                pattern='[0-9]*'
                value={quantity}
                disabled={isLoading}
                onChange={e =>
                  curUser
                    ? handleUpdateCartQuantity(+e.target.value, true)
                    : handleUpdateLocalCartQuantity(+e.target.value, true)
                }
              />
              <button
                className={`flex items-center justify-center px-3 py-[10px] group rounded-tr-md rounded-br-md hover:bg-secondary border common-transition ${
                  quantity >= cartItem.product?.stock! || isLoading
                    ? 'pointer-events-none border-slate-100 bg-slate-100'
                    : ' border-secondary'
                }`}
                disabled={quantity >= cartItem.product?.stock! || isLoading}
                onClick={() =>
                  curUser ? handleUpdateCartQuantity(1) : handleUpdateLocalCartQuantity(1)
                }>
                {isLoading ? (
                  <RiDonutChartFill size={16} className='animate-spin text-slate-300' />
                ) : (
                  <FaPlus
                    size={16}
                    className={`group-hover:text-white group-hover:scale-110 common-transition ${
                      quantity >= cartItem.product?.stock! || isLoading
                        ? 'text-slate-300'
                        : 'text-secondary'
                    }`}
                  />
                )}
              </button>
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
              open={isOpenConfirmModal}
              setOpen={setIsOpenConfirmModal}
              title='Xóa sản phẩm khỏi giỏ hàng'
              content='Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?'
              onAccept={() => handleDeleteCartItem()}
              isLoading={isDeleting}
            />

            <FaTrashAlt
              size={21}
              className='text-secondary cursor-pointer hover:scale-110 common-transition'
              // onClick={handleDeleteCartItem}
              onClick={() => setIsOpenConfirmModal(true)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartItem
