'use client'

import Pagination from '@/components/Pagination'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/loadingReducer'
import { ICategory } from '@/models/CategoryModel'
import { IProduct } from '@/models/ProductModel'
import { ITag } from '@/models/TagModel'
import { formatPrice } from '@/utils/formatNumber'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaEyeSlash, FaFilter, FaPlus, FaTrash } from 'react-icons/fa'
import { FaBoltLightning } from 'react-icons/fa6'
import { MdEdit } from 'react-icons/md'

export type ProductWithTagsAndCategory = IProduct & { tags: ITag[]; category: ICategory }

function AllProductsPage() {
  // hook
  const dispatch = useAppDispatch()
  const isPageLoading = useAppSelector(state => state.loading.isPageLoading)

  // states
  const [products, setProducts] = useState<ProductWithTagsAndCategory[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      orderCode: '',
    },
  })

  // get all product
  useEffect(() => {
    const getAllProducts = async () => {
      dispatch(setPageLoading(true))

      try {
        // send request to server to get all products
        const res = await axios.get('/api/admin/product/all')
        console.log(res)

        // set products to state
        setProducts(res.data.products)
      } catch (err: any) {
        console.log(err)
        toast.error(err.response.data.message)
      } finally {
        dispatch(setPageLoading(false))
      }
    }
    getAllProducts()
  }, [dispatch])

  return (
    <div className='w-full'>
      <div className='flex items-end mb-3 gap-3'>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-white hover:text-primary'
          href='/admin'>
          <FaArrowLeft />
          Admin
        </Link>
        <div className='py-2 px-3 text-light border border-slate-300 rounded-lg text-2xl'>
          All Products
        </div>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'
          href='/admin/product/add'>
          <FaPlus />
          Add
        </Link>
      </div>

      <Pagination />

      <div className='pt-8' />

      <div className='bg-white self-end w-full rounded-medium shadow-md text-dark overflow-auto transition-all duration-300 no-scrollbar p-21 max-w-ful'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-21'>
          <div className='flex flex-col'>
            <label>
              <span className='font-bold'>Price: </span>
              <span>{formatPrice(9000)}</span>
              {' - '}
              <span>{formatPrice(2000000)}</span>
            </label>
            <input
              className='input-range h-2 bg-slate-200 rounded-lg my-2'
              type='range'
              min='9000'
              max='2000000'
              value={9000}
              onChange={() => {}}
            />
          </div>
          <div className='flex flex-col'>
            <label>
              <span className='font-bold'>Sold: </span>
              <span>{formatPrice(9000)}</span>
              {' - '}
              <span>{formatPrice(2000000)}</span>
            </label>
            <input
              className='input-range h-2 bg-slate-200 rounded-lg my-2'
              type='range'
              min='9000'
              max='2000000'
              value={9000}
              onChange={() => {}}
            />
          </div>
          <div className='flex flex-col'>
            <label>
              <span className='font-bold'>Stock: </span>
              <span>{formatPrice(9000)}</span>
              {' - '}
              <span>{formatPrice(2000000)}</span>
            </label>
            <input
              className='input-range h-2 bg-slate-200 rounded-lg my-2'
              type='range'
              min='9000'
              max='2000000'
              value={9000}
              onChange={() => {}}
            />
          </div>
          <div className='flex justify-end items-center flex-wrap gap-3'>Select</div>
          <div className='flex justify-end md:justify-start items-center'>
            <button className='group flex items-center text-nowrap bg-secondary text-[14px] font-semibold p-2 rounded-md cursor-pointer hover:bg-primary text-light hover:text-dark common-transition'>
              Lọc
              <FaFilter size={12} className='ml-1 text-light group-hover:text-dark common-transition' />
            </button>
          </div>

          <div className='flex justify-end items-center col-span-2 gap-2'>
            <button className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'>
              Delete
            </button>
            <button className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'>
              Remove flashsales
            </button>
            <button className='border border-green-400 text-green-400 rounded-lg px-3 py-2 hover:bg-green-400 hover:text-light common-transition'>
              Activate
            </button>
            <button className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'>
              Deactivate
            </button>
          </div>
        </div>
      </div>

      <div className='pt-9' />

      <div className='grid grid-cols-2 gap-21 lg:grid-cols-3'>
        {products.map(product => (
          <div
            className='relative flex justify-between items-start gap-2 p-4 rounded-lg shadow-lg bg-white'
            key={product._id}>
            <div>
              {/* Thumbnails */}
              <Link
                href='/netflix'
                className='float-left mr-4 flex items-center max-w-[160px] rounded-lg shadow-md overflow-hidden'>
                <div className='flex items-center w-full overflow-x-scroll snap-x no-scrollbar'>
                  {product.images.map((src, index) => (
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
              {product.flashsale && (
                <FaBoltLightning
                  className='absolute -top-1 -left-1 text-yellow-400 animate-bounce'
                  size={22}
                />
              )}
              <p
                className='inline font-semibold text-[18px] mr-2 leading-4 font-body tracking-wide'
                title={product.title}>
                {product.title}
              </p>
              <div className='inline-flex items-center flex-wrap gap-2'>
                <p className='font-semibold text-xl text-primary'>{formatPrice(product.price)}</p>
                {product.oldPrice && (
                  <p className='line-through text-slate-500 text-sm'>{formatPrice(product.oldPrice)}</p>
                )}
              </div>
              <div className='inline-flex items-center gap-3'>
                <p>
                  <span className='font-semibold'>Sold:</span>{' '}
                  <span className='text-green-500'>{product.sold}</span>
                </p>
                <p>
                  <span className='font-semibold'>Stock: </span>
                  <span className='text-yellow-500'>{product.stock}</span>
                </p>
              </div>
              <p className='text-slate-500'>
                <span className='text-dark font-semibold'>Tags: </span>
                {product.tags.map((tag: ITag) => (
                  <span key={tag.slug} className='text-slate-400'>
                    {tag.title}
                  </span>
                ))}
              </p>
              <p className='text-rose-600'>
                <span className='font-semibold text-dark'>Category: </span>{' '}
                <span>{product.category.title}</span>
              </p>
            </div>

            <div className='flex flex-col border border-dark text-dark rounded-lg px-2 py-3 gap-4'>
              <Link href={`/admin/product/${product._id}/edit`} className='block group'>
                <MdEdit size={18} className='group-hover:scale-125 common-transition' />
              </Link>
              <button className='block group'>
                <FaTrash size={18} className='group-hover:scale-125 common-transition' />
              </button>
              <button className='block group'>
                <FaEyeSlash size={18} className='group-hover:scale-125 common-transition' />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllProductsPage
