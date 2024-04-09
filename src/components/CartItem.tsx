import { FullyCartItem } from '@/app/api/cart/route'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import {
  addCartItem,
  deleteCartItem,
  deleteLocalCartItem,
  setSelectedItems,
  updateCartItemQuantity,
  updateLocalCartItemQuantity,
} from '@/libs/reducers/cartReducer'
import { addToCartApi, deleteCartItemApi, updateCartQuantityApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaHashtag, FaMinus, FaPlus, FaPlusSquare, FaTrashAlt } from 'react-icons/fa'
import { RiDonutChartFill } from 'react-icons/ri'
import { TbPackages } from 'react-icons/tb'
import ConfirmDialog from './ConfirmDialog'
import Price from './Price'

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
  const selectedCartItems = useAppSelector(state => state.cart.selectedItems)
  const curUser: any = session?.user

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const inputRef = useRef<any>({})
  const quantity = cartItem.quantity

  // handle delete cart item
  const handleDeleteCartItem = useCallback(async () => {
    // start deleting
    setIsDeleting(true)

    try {
      const { deletedCartItem, message } = await deleteCartItemApi(cartItem._id)
      dispatch(deleteCartItem(deletedCartItem._id))

      // show toast success
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
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
      const { cartItem: cI, message } = await addToCartApi(cartItem.productId, cartItem.quantity)

      // add cart item to state
      dispatch(addCartItem(cI))

      // show toast success
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setIsLoading(false)
    }

    // delete local cart item
    handleDeleteLocalCartItem()
  }, [handleDeleteLocalCartItem, cartItem.productId, dispatch, setIsLoading, cartItem.quantity])

  // update cart item quantity in database
  const updateQuantityGlobal = useCallback(
    async (value: number) => {
      console.log('update quantity global: ', value)

      try {
        // start loading
        setIsLoading(true)
        // send request to update cart quantity
        const { updatedCartItem } = await updateCartQuantityApi(cartItem._id, value)

        // update cart item in store
        dispatch(updateCartItemQuantity({ id: updatedCartItem._id, quantity: updatedCartItem.quantity }))
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setIsLoading(false)
      }
    },
    [cartItem._id, dispatch]
  )

  // handle update cart quantity
  const updateQuantity = useCallback(
    async (type: 'input' | 'button', value: number) => {
      if (type === 'button') {
        // decrease
        if (value === -1) {
          if (quantity <= 1) return
          if (curUser) {
            dispatch(
              updateCartItemQuantity({
                id: cartItem._id,
                quantity: quantity - 1,
              })
            )
            updateQuantityGlobal(quantity - 1)
          } else {
            dispatch(
              updateLocalCartItemQuantity({
                id: cartItem._id,
                quantity: quantity - 1,
              })
            )
          }
        } else if (value === 1) {
          // increase
          if (quantity >= cartItem.product.stock) return
          if (curUser) {
            dispatch(
              updateCartItemQuantity({
                id: cartItem._id,
                quantity: quantity + 1,
              })
            )
            updateQuantityGlobal(quantity + 1)
          } else {
            dispatch(
              updateLocalCartItemQuantity({
                id: cartItem._id,
                quantity: quantity + 1,
              })
            )
          }
        }
      }

      if (type === 'input') {
        // start input
        inputRef.current.isInputing = true
        dispatch(updateCartItemQuantity({ id: cartItem._id, quantity: value }))

        // continue input
        clearTimeout(inputRef.current.timeOut)

        // stop input after 500ms if no input
        inputRef.current.timeOut = setTimeout(() => {
          inputRef.current.isInputing = false
        }, 500)

        // update quantity after 500ms if no input
        setTimeout(() => {
          if (!inputRef.current.isInputing) {
            if (value <= 1) {
              if (curUser) {
                dispatch(updateCartItemQuantity({ id: cartItem._id, quantity: 1 }))
                updateQuantityGlobal(1)
              } else {
                dispatch(updateLocalCartItemQuantity({ id: cartItem._id, quantity: 1 }))
              }
            }
            if (value >= cartItem.product.stock) {
              if (curUser) {
                dispatch(updateCartItemQuantity({ id: cartItem._id, quantity: cartItem.product.stock }))
                updateQuantityGlobal(cartItem.product.stock)
              } else {
                dispatch(
                  updateLocalCartItemQuantity({ id: cartItem._id, quantity: cartItem.product.stock })
                )
              }
            } else {
              updateQuantityGlobal(value)
            }
          }
        }, 510)
      }
    },
    [cartItem._id, cartItem.product.stock, curUser, dispatch, quantity, updateQuantityGlobal]
  )

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
              alt={`/${cartItem.product.slug}`}
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

      {/* Body */}
      <div className={`relative w-full h-full ${localCartItem && !isCheckout ? 'pr-10' : ''}`}>
        {/* Title */}
        <Link href={`/${cartItem.product.slug}`}>
          <h2 className={`text-[20px] tracking-wide mb-2 leading-6 pr-8`} title={cartItem.product.title}>
            {cartItem.product.title}
          </h2>
        </Link>

        {/* Info */}
        {isOrderDetailProduct && (
          <div className='flex justify-between'>
            {/* (Order Detail) Quantity */}
            <div className='flex items-center gap-1 text-[16px]'>
              <FaHashtag className='text-darker' size={16} />
              <span className='text-darker font-bold text-nowrap'>Số lượng:</span>
              <span className='text-green-500'>{cartItem.quantity}</span>
            </div>

            {/* (Order Detail) Price */}
            <div className='flex items-center gap-1 text-[16px]'>
              <FaHashtag className='text-darker' size={16} />
              <span className='text-darker font-bold text-nowrap'>Giá:</span>
              <span className='text-green-500'>{formatPrice(cartItem.product.price)}</span>
            </div>
          </div>
        )}

        {/* Quantity - Price - Stock*/}
        {localCartItem ? (
          !isOrderDetailProduct && (
            <div className='flex flex-col gap-3 text-xl font-body tracking-wide'>
              {/* Quantity */}
              <div className='flex items-center gap-1 text-[16px]'>
                <FaHashtag className='text-darker' size={16} />
                <span className='text-darker font-bold text-nowrap'>Số lượng:</span>
                <span className='text-green-500'>{cartItem.quantity}</span>
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
              <span className='text-green-500'>{cartItem.product.stock}</span>
            </div>
          </>
        )}

        {/* Quantity Updater */}
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
                onClick={() => updateQuantity('button', -1)}>
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
                className='max-w-14 px-2 border-y border-slate-100 outline-none text-center text-lg text-dark font-semibold font-body number-input'
                type='number'
                inputMode='numeric'
                pattern='[0-9]*'
                value={quantity}
                disabled={isLoading}
                onWheel={e => e.currentTarget.blur()}
                onChange={e => updateQuantity('input', +e.target.value)}
              />

              <button
                className={`flex items-center justify-center px-3 py-[10px] group rounded-tr-md rounded-br-md hover:bg-secondary border common-transition ${
                  quantity >= cartItem.product?.stock! || isLoading
                    ? 'pointer-events-none border-slate-100 bg-slate-100'
                    : ' border-secondary'
                }`}
                disabled={quantity >= cartItem.product?.stock! || isLoading}
                onClick={() => updateQuantity('button', 1)}>
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
              onAccept={() => (curUser ? handleDeleteCartItem() : handleDeleteLocalCartItem())}
              isLoading={isDeleting}
            />

            <FaTrashAlt
              size={21}
              className='text-secondary cursor-pointer hover:scale-110 common-transition'
              onClick={() => setIsOpenConfirmModal(true)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartItem
