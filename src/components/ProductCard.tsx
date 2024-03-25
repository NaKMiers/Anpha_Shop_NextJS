import Image from 'next/image'
import { FaCartPlus } from 'react-icons/fa'
import { FaCircleCheck } from 'react-icons/fa6'
import Price from './Price'
import Link from 'next/link'
import { IProduct } from '@/models/ProductModel'
import { countPercent } from '@/utils/formatNumber'
import { useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

interface ProductCardProps {
  data: IProduct
  className?: string
}

function ProductCard({ data, className }: ProductCardProps) {
  // handle add product to cart
  const handleAddProductToCart = useCallback(async () => {
    try {
      // send request to add product to cart
      const res = await axios.post('/api/cart/add', { productId: data._id, quantity: 1 })
      console.log(res.data)

      // show toast success
      toast.success(res.data.message)
    } catch (err: any) {
      console.log(err.message)
      toast.error(err.response.data.message)
    }
  }, [data._id])

  return (
    <div
      className={`relative w-full p-4 bg-white shadow-lg rounded-xl select-none hover:-translate-y-1 transition duration-500 ${className}`}>
      <Link href={`/${data.slug}`} className='aspect-video rounded-lg overflow-hidden shadow-lg block'>
        <div className='flex w-full overflow-x-scroll snap-x'>
          {data.images.map(src => (
            <Image
              className='flex-shrink snap-start'
              src={src}
              width={200}
              height={200}
              alt='netflix'
              key={src}
            />
          ))}
        </div>
      </Link>

      {/* Badge */}
      {data.oldPrice && (
        <div className='absolute -top-2 -left-2 rounded-tl-lg rounded-br-lg bg-yellow-400 p-1 max-w-10 text-light font-semibold font-body text-center text-[13px] leading-4'>
          Giảm {countPercent(data.price, data.oldPrice)}
        </div>
      )}

      <Link href={`/${data.slug}`}>
        <h3
          className='font-body text-[18px] text-dark tracking-wide leading-[22px] my-3'
          title={data.title}>
          {data.title}
        </h3>
      </Link>

      <Price price={data.price} oldPrice={data.oldPrice} className='mb-2' />

      <div className='flex items-center font-body tracking-wide'>
        <FaCircleCheck size={16} className='text-darker' />
        <span className='font-bold text-darker ml-1'>Đã bán:</span>
        <span className='text-red-500 ml-1'>{data.sold}</span>
      </div>

      <div className='flex items-center justify-end md:justify-start gap-2 mt-2'>
        <button className='bg-secondary rounded-md text-white px-2 py-1 font-semibold font-body tracking-wider text-nowrap hover:bg-primary common-transition'>
          MUA NGAY
        </button>
        <button
          className='bg-primary px-2 py-[6px] rounded-md group hover:bg-secondary common-transition'
          onClick={handleAddProductToCart}>
          <FaCartPlus size={18} className='text-white group-hover:scale-110 common-transition' />
        </button>
      </div>
    </div>
  )
}

export default ProductCard
