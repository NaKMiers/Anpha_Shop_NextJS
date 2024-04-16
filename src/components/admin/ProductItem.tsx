import { ProductWithTagsAndCategory } from '@/app/(admin)/admin/product/all/page'
import { ITag } from '@/models/TagModel'
import { updateProductPropertyApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa'
import { FaBoltLightning } from 'react-icons/fa6'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../ConfirmDialog'
import { PiLightningFill, PiLightningSlashFill } from 'react-icons/pi'

interface ProductItemProps {
  data: ProductWithTagsAndCategory
  loadingProducts: string[]
  className?: string

  selectedProducts: string[]
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>

  handleActivateProducts: (ids: string[], active: boolean) => void
  hanldeRemoveApplyingFlashsales: (ids: string[]) => void
  handleDeleteProducts: (ids: string[]) => void
}

function ProductItem({
  data,
  loadingProducts,
  className = '',
  // selected
  selectedProducts,
  setSelectedProducts,
  // functions
  handleActivateProducts,
  hanldeRemoveApplyingFlashsales,
  handleDeleteProducts,
}: ProductItemProps) {
  // states
  const [fieldEditing, setFieldEditing] = useState<{ stock: boolean; sold: boolean }>({
    stock: false,
    sold: false,
  })
  const [fieldValue, setFieldValue] = useState<{ stock: number; sold: number }>({
    stock: data.stock,
    sold: data.sold,
  })
  const [fieldLoading, setFieldLoading] = useState<{ stock: boolean; sold: boolean }>({
    stock: false,
    sold: false,
  })
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)
  const [confirmType, setConfirmType] = useState<'deactivate' | 'delete'>('delete')

  // handle update product property
  const handleUpdateProductProperty = useCallback(
    async (id: string, field: 'stock' | 'sold') => {
      if (fieldValue[field] === data[field]) return

      setFieldLoading(prev => ({ ...prev, [field]: true }))

      try {
        const { newValue, message } = await updateProductPropertyApi(id, field, fieldValue[field])

        // show success message
        toast.success(message)

        setFieldValue(prev => ({ ...prev, [field]: newValue }))
        setFieldEditing(prev => ({ ...prev, [field]: false }))
        data[field] = newValue
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        setFieldLoading(prev => ({ ...prev, [field]: false }))
      }
    },

    [data, fieldValue]
  )

  return (
    <>
      <div
        className={`relative flex justify-between items-start gap-2 p-4 rounded-lg shadow-lg cursor-pointer common-transition ${
          selectedProducts.includes(data._id) ? 'bg-sky-50 -translate-y-1' : 'bg-white'
        }  ${className}`}
        onClick={() =>
          setSelectedProducts(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }>
        <div className='flex-grow'>
          {/* MARK: Thumbnails */}
          <Link
            href={`/${data.slug}`}
            prefetch={false}
            className='float-left mr-4 flex items-center max-w-[160px] rounded-lg shadow-md overflow-hidden mb-2'
            onClick={e => e.stopPropagation()}>
            <div className='flex items-center w-full overflow-x-scroll snap-x snap-mandatory no-scrollbar'>
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

          {/* Flash sale */}
          {data.flashsale && (
            <PiLightningFill
              className='absolute -top-1.5 left-1 text-yellow-400 animate-bounce'
              size={25}
            />
          )}

          {/* Title */}
          <p
            className='inline font-semibold text-[18px] mr-2 leading-4 font-body tracking-wide'
            title={data.title}>
            {data.title}
          </p>

          {/* Price - Old Price */}
          <div className='flex items-center flex-wrap gap-2'>
            <p className='font-semibold text-xl text-primary'>{formatPrice(data.price)}</p>
            {data.oldPrice && (
              <p className='line-through text-slate-500 text-sm'>{formatPrice(data.oldPrice)}</p>
            )}
          </div>

          <div className='flex w-full items-center gap-3'>
            {/* Sold */}
            <div
              className='flex items-center gap-1 cursor-pointer select-none'
              onDoubleClick={e => {
                e.stopPropagation()
                setFieldEditing(prev => ({ ...prev, sold: !prev.sold }))
                handleUpdateProductProperty(data._id, 'sold')
              }}
              onBlur={e => {
                e.stopPropagation()
                setFieldEditing(prev => ({ ...prev, sold: !prev.sold }))
                handleUpdateProductProperty(data._id, 'sold')
              }}
              onClick={e => e.stopPropagation()}>
              <span className='font-semibold'>
                {fieldLoading.sold ? (
                  <RiDonutChartFill size={16} className='animate-spin text-slate-300' />
                ) : (
                  'Sold:'
                )}
              </span>{' '}
              {fieldEditing.sold ? (
                <input
                  className='max-w-[40px] px-1 rounded-md border border-green-500 text-green-500 outline-none text-ellipsis'
                  value={fieldValue.sold}
                  onChange={e => setFieldValue(prev => ({ ...prev, sold: +e.target.value }))}
                  disabled={fieldLoading.sold}
                  type='text'
                />
              ) : (
                <span className='text-green-500'>{fieldValue.sold}</span>
              )}
            </div>

            {/* Stock */}
            <div
              className='flex items-center gap-1 cursor-pointer select-none'
              onDoubleClick={e => {
                e.stopPropagation()
                setFieldEditing(prev => ({ ...prev, stock: !prev.stock }))
                handleUpdateProductProperty(data._id, 'stock')
              }}
              onBlur={e => {
                e.stopPropagation()
                setFieldEditing(prev => ({ ...prev, stock: !prev.stock }))
                handleUpdateProductProperty(data._id, 'stock')
              }}
              onClick={e => e.stopPropagation()}>
              <span className='font-semibold'>
                {fieldLoading.stock ? (
                  <RiDonutChartFill size={16} className='animate-spin text-slate-300' />
                ) : (
                  'Stock:'
                )}
              </span>{' '}
              {fieldEditing.stock ? (
                <input
                  className='max-w-[40px] px-1 rounded-md border border-yellow-500 text-yellow-500 outline-none text-ellipsis'
                  value={fieldValue.stock}
                  onChange={e => setFieldValue(prev => ({ ...prev, stock: +e.target.value }))}
                  disabled={fieldLoading.sold}
                  type='text'
                />
              ) : (
                <span className='text-yellow-500'>{fieldValue.stock}</span>
              )}
            </div>
          </div>

          {/* MARK: Tags */}
          <p className='text-slate-500'>
            <span className='text-dark font-semibold'>Tags: </span>
            {data.tags.map((tag: ITag, index) => (
              <span key={tag.slug} className='text-slate-400'>
                {tag.title}
                {index < data.tags.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>

          {/* MARK: Category */}
          <p className='text-orange-600'>
            <span className='font-semibold text-dark'>Category: </span>{' '}
            <span>{data.category.title}</span>
          </p>
        </div>

        {/* MARK: Action Buttons */}
        <div className='flex flex-col border border-dark text-dark rounded-lg px-2 py-3 gap-4'>
          {/* Active Button */}
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              // is being active
              if (data.active) {
                setIsOpenConfirmModal(true)
                setConfirmType('deactivate')
              } else {
                handleActivateProducts([data._id], true)
              }
            }}
            title={data.active ? 'Deactivate' : 'Activate'}>
            {data.active ? (
              <FaEye size={18} className='group-hover:scale-125 common-transition text-green-500' />
            ) : (
              <FaEyeSlash size={18} className='group-hover:scale-125 common-transition text-slate-300' />
            )}
          </button>

          {/* Remove Flashsale Button */}
          {data.flashsale && (
            <button
              className='block group'
              onClick={e => {
                e.stopPropagation()
                hanldeRemoveApplyingFlashsales([data._id])
              }}
              title='Remove Flash Sale'>
              <PiLightningSlashFill size={18} className='group-hover:scale-125 common-transition' />
            </button>
          )}

          {/* Edit Button Link */}
          <Link
            href={`/admin/product/${data._id}/edit`}
            className='block group'
            onClick={e => e.stopPropagation()}
            title='Edit'>
            <MdEdit size={18} className='group-hover:scale-125 common-transition' />
          </Link>

          {/* Delete Button */}
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              setIsOpenConfirmModal(true)
            }}
            disabled={loadingProducts.includes(data._id)}
            title='Delete'>
            {loadingProducts.includes(data._id) ? (
              <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
            ) : (
              <FaTrash size={18} className='group-hover:scale-125 common-transition' />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title={`${confirmType.charAt(0).toUpperCase() + confirmType.slice(1)} Product`}
        content={`Are you sure that you want to ${confirmType} this product?`}
        onAccept={() =>
          confirmType === 'deactivate'
            ? handleActivateProducts([data._id], false)
            : handleDeleteProducts([data._id])
        }
        isLoading={loadingProducts.includes(data._id)}
      />
    </>
  )
}

export default ProductItem
