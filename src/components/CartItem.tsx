import { FullyCartItem } from '@/app/api/cart/route'
import { formatPrice } from '@/utils/formatNumber'
import Image from 'next/image'
import Link from 'next/link'
import { FaHashtag, FaMinus, FaPlus, FaPlusSquare, FaTrashAlt } from 'react-icons/fa'
import { TbPackages } from 'react-icons/tb'
import Price from './Price'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

interface CartItemProps {
  data: FullyCartItem
  isLocalCartItem?: boolean
  className?: string
  isCheckout?: boolean
  isOrderDetailProduct?: boolean
}

function CartItem({
  data,
  isLocalCartItem,
  isCheckout,
  className,
  isOrderDetailProduct,
}: CartItemProps) {
  const handleDeleteCartItem = useCallback(async () => {
    try {
      const res = await axios.delete(`/api/cart/${data._id}`)
      console.log(res.data)

      // show toast success
      toast.success(res.data.message)
    } catch (err: any) {
      console.log(err.message)
      toast.error(err.response.data.message)
    }
  }, [])

  return (
    <div
      className={`relative flex flex-wrap md:flex-nowrap items-start gap-3 ${className} ${
        isLocalCartItem ? '' : 'rounded-medium border border-slate-400 p-21'
      }`}>
      <Link
        href={`/${data.product.slug}`}
        className='aspect-video rounded-lg overflow-hidden shadow-lg block max-w-[150px]'>
        <div className='flex w-full overflow-x-scroll snap-x no-scrollbar'>
          {data.product.images.map(src => (
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

      {isLocalCartItem && !isCheckout && (
        <div className='absolute z-10 top-1 right-4  flex flex-col gap-2'>
          <FaPlusSquare
            size={21}
            className='text-primary cursor-pointer hover:scale-110 common-transition'
          />
          <FaTrashAlt
            size={21}
            className='text-secondary cursor-pointer hover:scale-110 common-transition'
          />
        </div>
      )}

      {!isLocalCartItem && <input type='checkbox' className='size-5 absolute top-21 right-21' />}

      <div className={`relative w-full h-full ${isLocalCartItem && !isCheckout ? 'pr-10' : ''}`}>
        <Link href='/netflix'>
          <h2 className={`text-[20px] tracking-wide mb-2 leading-6`} title={data.product.title}>
            {data.product.title}
          </h2>
        </Link>

        {isOrderDetailProduct && (
          <div className='flex justify-between'>
            <div className='flex items-center gap-1 text-[16px]'>
              <FaHashtag className='text-darker' size={16} />
              <span className='text-darker font-bold text-nowrap'>Số lượng:</span>
              <span className='text-green-500'>{data.quantity}</span>
            </div>

            <div className='flex items-center gap-1 text-[16px]'>
              <FaHashtag className='text-darker' size={16} />
              <span className='text-darker font-bold text-nowrap'>Giá:</span>
              <span className='text-green-500'>{formatPrice(data.product.price)}</span>
            </div>
          </div>
        )}

        {isLocalCartItem ? (
          !isOrderDetailProduct && (
            <div className='flex flex-col gap-3 text-xl font-body tracking-wide'>
              <div className='flex items-center gap-1 text-[16px]'>
                <FaHashtag className='text-darker' size={16} />
                <span className='text-darker font-bold text-nowrap'>Số lượng:</span>
                <span className='text-green-500'>{data.quantity}</span>
              </div>
            </div>
          )
        ) : (
          <>
            <Price price={9000} />
            <div className='flex items-center gap-1 mt-2 text-[16px]'>
              <TbPackages className='text-darker' size={22} />
              <span className='text-darker font-bold text-nowrap font-body tracking-wide'>Còn lại:</span>
              <span className='text-green-500'>{data.product.stock}</span>
            </div>
          </>
        )}

        {/* Quantity */}
        {!isLocalCartItem && (
          <div className='flex items-center justify-between'>
            <div className='inline-flex border-[1.5px] border-secondary rounded-md overflow-hidden my-3'>
              <button className='flex items-center justify-center px-3 py-[10px] group hover:bg-secondary common-transition'>
                <FaMinus
                  size={16}
                  className='text-secondary group-hover:text-white group-hover:scale-110 common-transition'
                />
              </button>
              <input
                className='max-w-14 px-2 outline-none text-center text-lg text-dark font-semibold font-body border-x-[1.5px] border-secondary'
                type='text'
                inputMode='numeric'
                pattern='[0-9]*'
              />
              <button className='flex items-center justify-center px-3 py-[10px] group hover:bg-secondary common-transition'>
                <FaPlus
                  size={16}
                  className='text-secondary group-hover:text-white group-hover:scale-110 common-transition'
                />
              </button>
            </div>

            <FaTrashAlt
              size={21}
              className='text-secondary cursor-pointer hover:scale-110 common-transition'
              onClick={handleDeleteCartItem}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartItem
