import { ProductWithTagsAndCategory } from '@/app/(admin)/admin/product/all/page'
import { IProduct } from '@/models/ProductModel'
import { ITag } from '@/models/TagModel'
import { formatPrice } from '@/utils/formatNumber'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa'
import { FaBoltLightning } from 'react-icons/fa6'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'

interface ProductItemProps {
  data: ProductWithTagsAndCategory
  loadingProducts: string[]
  className?: string

  selectedProducts: string[]
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>

  handleActivateProducts: (ids: string[], active: boolean) => void
  handleDeleteProducts: (ids: string[]) => void
}

function ProductItem({
  data,
  loadingProducts,
  className,
  // selected
  selectedProducts,
  setSelectedProducts,
  // functions
  handleActivateProducts,
  handleDeleteProducts,
}: ProductItemProps) {
  return (
    <div
      className={`relative flex justify-between items-start gap-2 p-4 rounded-lg shadow-lg cursor-pointer common-transition ${
        selectedProducts.includes(data._id) ? 'bg-sky-50 -translate-y-1' : 'bg-white'
      }  ${className}`}
      onClick={() =>
        setSelectedProducts(prev =>
          prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
        )
      }>
      <div>
        {/* Thumbnails */}
        <Link
          href='/netflix'
          className='float-left mr-4 flex items-center max-w-[160px] rounded-lg shadow-md overflow-hidden'>
          <div className='flex items-center w-full overflow-x-scroll snap-x no-scrollbar'>
            {data.images.map((src, index) => (
              <Image
                key={index}
                className='aspect-video flex-shrink-0 snap-start'
                src={src}
                height={200}
                width={200}
                alt='thumbnail'
              />
            ))}
          </div>
        </Link>

        {/* Infomation */}
        {data.flashsale && (
          <FaBoltLightning
            className='absolute -top-1 -left-1 text-yellow-400 animate-bounce'
            size={22}
          />
        )}
        <p
          className='inline font-semibold text-[18px] mr-2 leading-4 font-body tracking-wide'
          title={data.title}>
          {data.title}
        </p>
        <div className='inline-flex items-center flex-wrap gap-2'>
          <p className='font-semibold text-xl text-primary'>{formatPrice(data.price)}</p>
          {data.oldPrice && (
            <p className='line-through text-slate-500 text-sm'>{formatPrice(data.oldPrice)}</p>
          )}
        </div>
        <div className='inline-flex items-center gap-3'>
          <p>
            <span className='font-semibold'>Sold:</span>{' '}
            <span className='text-green-500'>{data.sold}</span>
          </p>
          <p>
            <span className='font-semibold'>Stock: </span>
            <span className='text-yellow-500'>{data.stock}</span>
          </p>
        </div>
        <p className='text-slate-500'>
          <span className='text-dark font-semibold'>Products: </span>
          {data.tags.map((tag: ITag) => (
            <span key={tag.slug} className='text-slate-400'>
              {tag.title}
            </span>
          ))}
        </p>
        <p className='text-rose-600'>
          <span className='font-semibold text-dark'>Category: </span> <span>{data.category.title}</span>
        </p>
      </div>

      <div className='flex flex-col border border-dark text-dark rounded-lg px-2 py-3 gap-4'>
        {/* Edit Button Link */}
        <Link
          href={`/admin/product/${data._id}/edit`}
          target='_blank'
          className='block group'
          onClick={e => e.stopPropagation()}>
          <MdEdit size={18} className='group-hover:scale-125 common-transition' />
        </Link>

        {/* Delete Button */}
        <button
          className='block group'
          onClick={e => {
            e.stopPropagation()
            handleDeleteProducts([data._id])
          }}
          disabled={loadingProducts.includes(data._id)}>
          {loadingProducts.includes(data._id) ? (
            <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
          ) : (
            <FaTrash size={18} className='group-hover:scale-125 common-transition' />
          )}
        </button>

        {/* Active Button */}
        <button
          className='block group'
          onClick={e => {
            e.stopPropagation()
            handleActivateProducts([data._id], !data.active)
          }}>
          {data.active ? (
            <FaEye size={18} className='group-hover:scale-125 common-transition text-green-500' />
          ) : (
            <FaEyeSlash size={18} className='group-hover:scale-125 common-transition text-slate-300' />
          )}
        </button>
      </div>
    </div>
  )
}

export default ProductItem
