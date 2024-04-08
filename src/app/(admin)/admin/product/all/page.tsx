'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import ProductItem from '@/components/admin/ProductItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICategory } from '@/models/CategoryModel'
import { IProduct } from '@/models/ProductModel'
import { ITag } from '@/models/TagModel'
import { activateProductsApi, deleteProductsApi, getAllProductsApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import { handleQuery } from '@/utils/handleQuery'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BiReset } from 'react-icons/bi'
import { FaFilter, FaSort } from 'react-icons/fa'

export type ProductWithTagsAndCategory = IProduct & { tags: ITag[]; category: ICategory }

function AllProductsPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [products, setProducts] = useState<ProductWithTagsAndCategory[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [tgs, setTgs] = useState<ITag[]>([])
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([])
  const [cates, setCates] = useState<ICategory[]>([])
  const [selectedFilterCates, setSelectedFilterCates] = useState<string[]>([])

  // loading and confirming
  const [loadingProducts, setLoadingProducts] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 9
  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(0)
  const [price, setPrice] = useState<number>(0)

  const [minSold, setMinSold] = useState<number>(0)
  const [maxSold, setMaxSold] = useState<number>(0)
  const [sold, setSold] = useState<number>(0)

  const [minStock, setMinStock] = useState<number>(0)
  const [maxStock, setMaxStock] = useState<number>(0)
  const [stock, setStock] = useState<number>(0)

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      sort: 'updatedAt|-1',
      active: '',
      flashsale: '',
    },
  })

  // get all products
  useEffect(() => {
    // get all products
    const getAllProducts = async () => {
      const query = handleQuery(searchParams)
      console.log(query)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // send request to server to get all products
        const { products, amount, cates, tgs, chops } = await getAllProductsApi(query)

        // set products to state
        setProducts(products)
        setAmount(amount)
        setCates(cates)
        setTgs(tgs)

        setSelectedFilterCates(
          []
            .concat((searchParams?.category || cates.map((cate: ICategory) => cate._id)) as [])
            .map(type => type)
        )

        setSelectedFilterTags(
          [].concat((searchParams?.tag || tgs.map((tag: ITag) => tag._id)) as []).map(type => type)
        )

        // get min - max
        setMinPrice(chops.minPrice)
        setMaxPrice(chops.maxPrice)
        setPrice(searchParams?.price ? +searchParams.price : chops.maxPrice)

        setMinStock(chops.minStock)
        setMaxStock(chops.maxStock)
        setStock(searchParams?.stock ? +searchParams.stock : chops.maxStock)

        setMinSold(chops.minSold)
        setMaxSold(chops.maxSold)
        setSold(searchParams?.sold ? +searchParams.sold : chops.maxSold)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllProducts()
  }, [dispatch, searchParams])

  // activate product
  const handleActivateProducts = useCallback(async (ids: string[], value: boolean) => {
    try {
      // senred request to server
      const { updatedProducts, message } = await activateProductsApi(ids, value)
      console.log(updatedProducts, message)

      // update products from state
      setProducts(prev =>
        prev.map(product =>
          updatedProducts.map((product: ProductWithTagsAndCategory) => product._id).includes(product._id)
            ? { ...product, active: value }
            : product
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // delete product
  const handleDeleteProducts = useCallback(async (ids: string[]) => {
    setLoadingProducts(ids)

    try {
      // senred request to server
      const { deletedProducts, message } = await deleteProductsApi(ids)

      // remove deleted products from state
      setProducts(prev =>
        prev.filter(
          product =>
            !deletedProducts
              .map((product: ProductWithTagsAndCategory) => product._id)
              .includes(product._id)
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingProducts([])
      setSelectedProducts([])
    }
  }, [])

  // handle opimize filter
  const handleOptimizeFilter: SubmitHandler<FieldValues> = useCallback(
    data => {
      console.log(data)

      // prevent sort default
      if (data.sort === 'updatedAt|-1') {
        if (Object.keys(searchParams || {}).length) {
          data.sort = ''
        } else {
          delete data.sort
        }
      }

      return {
        ...data,
        price: price === maxPrice ? [] : [price.toString()],
        sold: sold === maxSold ? [] : [sold.toString()],
        stock: stock === maxStock ? [] : [stock.toString()],
        category: selectedFilterCates.length === cates.length ? [] : selectedFilterCates,
        tags: selectedFilterTags.length === tgs.length ? [] : selectedFilterTags,
      }
    },
    [
      cates,
      maxPrice,
      maxSold,
      maxStock,
      price,
      selectedFilterCates,
      selectedFilterTags,
      sold,
      stock,
      tgs,
      searchParams,
    ]
  )

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    async data => {
      const params: any = handleOptimizeFilter(data)

      // handle query
      const query = handleQuery({
        ...searchParams,
        ...params,
      })

      // push to router
      console.log(query)
      router.push(pathname + query)
    },
    [handleOptimizeFilter, router, searchParams, pathname]
  )

  // handle reset filter
  const handleResetFilter = useCallback(() => {
    reset()
    router.push(pathname)
  }, [reset, router, pathname])

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A (Select All)
      if (e.altKey && e.key === 'a') {
        e.preventDefault()
        setSelectedProducts(prev =>
          prev.length === products.length ? [] : products.map(product => product._id)
        )
      }

      // Alt + Delete (Delete)
      if (e.altKey && e.key === 'Delete') {
        e.preventDefault()
        setIsOpenConfirmModal(true)
      }

      // Alt + F (Filter)
      if (e.altKey && e.key === 'f') {
        e.preventDefault()
        handleSubmit(handleFilter)()
      }

      // Alt + R (Reset)
      if (e.altKey && e.key === 'r') {
        e.preventDefault()
        handleResetFilter()
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFilter, handleResetFilter, products, handleSubmit])

  return (
    <div className='w-full'>
      {/* Top & Pagination */}
      <AdminHeader title='All Products' addLink='/admin/product/add' />
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      {/* Filter */}
      <div className='mt-8 bg-white self-end w-full rounded-medium shadow-md text-dark overflow-auto transition-all duration-300 no-scrollbar p-21 max-w-ful'>
        <div className='grid grid-cols-12 gap-21'>
          {/* Price */}
          <div className='flex flex-col col-span-12 md:col-span-4'>
            <label htmlFor='price'>
              <span className='font-bold'>Price: </span>
              <span>{formatPrice(price)}</span> - <span>{formatPrice(maxPrice)}</span>
            </label>
            <input
              id='price'
              className='input-range h-2 bg-slate-200 rounded-lg my-2'
              placeholder=' '
              disabled={false}
              type='range'
              min={minPrice || 0}
              max={maxPrice || 0}
              value={price}
              onChange={e => setPrice(+e.target.value)}
            />
          </div>

          {/* Sold */}
          <div className='flex flex-col col-span-12 md:col-span-4'>
            <label htmlFor='sold'>
              <span className='font-bold'>Sold: </span>
              <span>{sold}</span> - <span>{maxSold}</span>
            </label>
            <input
              id='sold'
              className='input-range h-2 bg-slate-200 rounded-lg my-2'
              placeholder=' '
              disabled={false}
              type='range'
              min={minSold || 0}
              max={maxSold || 0}
              value={sold}
              onChange={e => setSold(+e.target.value)}
            />
          </div>

          {/* Stock */}
          <div className='flex flex-col col-span-12 md:col-span-4'>
            <label htmlFor='stock'>
              <span className='font-bold'>Stock: </span>
              <span>{stock}</span> - <span>{maxStock}</span>
            </label>
            <input
              id='stock'
              className='input-range h-2 bg-slate-200 rounded-lg my-2'
              placeholder=' '
              disabled={false}
              type='range'
              min={minStock || 0}
              max={maxStock || 0}
              value={stock}
              onChange={e => setStock(+e.target.value)}
            />
          </div>

          {/* Cate Selection */}
          <div className='flex justify-end items-end gap-1 flex-wrap max-h-[228px] md:max-h-[152px] lg:max-h-[152px] overflow-auto col-span-12'>
            <div
              className={`overflow-hidden max-w-60 text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none common-transition ${
                cates.length === selectedFilterCates.length
                  ? 'bg-dark-100 text-white border-dark-100'
                  : 'border-slate-300'
              }`}
              title='All Types'
              onClick={() =>
                setSelectedFilterCates(
                  cates.length === selectedFilterCates.length ? [] : cates.map(category => category._id)
                )
              }>
              All
            </div>
            {cates.map(category => (
              <div
                className={`overflow-hidden max-w-60 text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none common-transition ${
                  selectedFilterCates.includes(category._id)
                    ? 'bg-primary text-white border-primary'
                    : 'border-slate-300'
                }`}
                title={category.title}
                key={category._id}
                onClick={
                  selectedFilterCates.includes(category._id)
                    ? () => setSelectedFilterCates(prev => prev.filter(id => id !== category._id))
                    : () => setSelectedFilterCates(prev => [...prev, category._id])
                }>
                {category.title}
              </div>
            ))}
          </div>

          {/* Tag Selection */}
          <div className='flex justify-end items-end gap-1 flex-wrap max-h-[228px] md:max-h-[152px] lg:max-h-[152px] overflow-auto col-span-12'>
            <div
              className={`overflow-hidden max-w-60 text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none common-transition ${
                tgs.length === selectedFilterTags.length
                  ? 'bg-dark-100 text-white border-dark-100'
                  : 'border-slate-300'
              }`}
              title='All Types'
              onClick={() =>
                setSelectedFilterTags(
                  tgs.length === selectedFilterTags.length ? [] : tgs.map(tag => tag._id)
                )
              }>
              All
            </div>
            {tgs.map(tag => (
              <div
                className={`overflow-hidden max-w-60 text-ellipsis text-nowrap h-[34px] leading-[34px] px-2 rounded-md border cursor-pointer select-none common-transition ${
                  selectedFilterTags.includes(tag._id)
                    ? 'bg-secondary text-white border-secondary'
                    : 'border-slate-300'
                }`}
                title={tag.title}
                key={tag._id}
                onClick={
                  selectedFilterTags.includes(tag._id)
                    ? () => setSelectedFilterTags(prev => prev.filter(id => id !== tag._id))
                    : () => setSelectedFilterTags(prev => [...prev, tag._id])
                }>
                {tag.title}
              </div>
            ))}
          </div>

          {/* Select Filter */}
          <div className='flex justify-end items-center flex-wrap gap-3 col-span-12 md:col-span-8'>
            {/* Sort */}
            <Input
              id='sort'
              label='Sort'
              disabled={false}
              register={register}
              errors={errors}
              icon={FaSort}
              type='select'
              options={[
                {
                  value: 'createdAt|-1',
                  label: 'Newest',
                },
                {
                  value: 'createdAt|1',
                  label: 'Oldest',
                },
                {
                  value: 'updatedAt|-1',
                  label: 'Latest',
                  selected: true,
                },
                {
                  value: 'updatedAt|1',
                  label: 'Earliest',
                },
              ]}
            />

            {/* Active */}
            <Input
              id='active'
              label='Active'
              disabled={false}
              register={register}
              errors={errors}
              icon={FaSort}
              type='select'
              options={[
                {
                  value: '',
                  label: 'All',
                  selected: true,
                },
                {
                  value: 'true',
                  label: 'On',
                },
                {
                  value: 'false',
                  label: 'Off',
                },
              ]}
            />

            {/* Flash Sale */}
            <Input
              id='flashsale'
              label='Flash Sale'
              disabled={false}
              register={register}
              errors={errors}
              icon={FaSort}
              type='select'
              options={[
                {
                  value: '',
                  label: 'All',
                  selected: true,
                },
                {
                  value: 'true',
                  label: 'On',
                },
                {
                  value: 'false',
                  label: 'Off',
                },
              ]}
            />
          </div>

          {/* Filter Buttons */}
          <div className='flex justify-end gap-2 items-center col-span-12 md:col-span-4'>
            {/* Filter Button */}
            <button
              className='group flex items-center text-nowrap bg-primary text-[16px] font-semibold py-2 px-3 rounded-md cursor-pointer hover:bg-secondary text-white common-transition'
              title='Alt + Enter'
              onClick={handleSubmit(handleFilter)}>
              Filter
              <FaFilter size={16} className='ml-1 common-transition' />
            </button>

            {/* Reset Button */}
            <button
              className='group flex items-center text-nowrap bg-slate-600 text-[16px] font-semibold py-2 px-3 rounded-md cursor-pointer hover:bg-slate-800 text-white common-transition'
              title='Alt + R'
              onClick={handleResetFilter}>
              Reset
              <BiReset size={24} className='ml-1 common-transition' />
            </button>
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end items-center col-span-12 gap-2'>
            {/* Select All Button */}
            <button
              className='border border-sky-400 text-sky-400 rounded-lg px-3 py-2 hover:bg-sky-400 hover:text-light common-transition'
              onClick={() =>
                setSelectedProducts(
                  selectedProducts.length > 0 ? [] : products.map(product => product._id)
                )
              }>
              {selectedProducts.length > 0 ? 'Unselect All' : 'Select All'}
            </button>

            {/* Activate Many Button */}
            {/* Only show activate button if at least 1 product is selected and at least 1 selected product is deactive */}
            {!!selectedProducts.length &&
              selectedProducts.some(id => !products.find(product => product._id === id)?.active) && (
                <button
                  className='border border-green-400 text-green-400 rounded-lg px-3 py-2 hover:bg-green-400 hover:text-light common-transition'
                  onClick={() => handleActivateProducts(selectedProducts, true)}>
                  Activate
                </button>
              )}

            {/* Deactivate Many Button */}
            {/* Only show deactivate button if at least 1 product is selected and at least 1 selected product is acitve */}
            {!!selectedProducts.length &&
              selectedProducts.some(id => products.find(product => product._id === id)?.active) && (
                <button
                  className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'
                  onClick={() => handleActivateProducts(selectedProducts, false)}>
                  Deactivate
                </button>
              )}

            {/* Remove Flash Sale Many Button */}
            {!!selectedProducts.length && (
              <button
                className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'
                onClick={() => {
                  handleDeleteProducts(selectedProducts)
                }}>
                Remove Flash Sale
              </button>
            )}

            {/* Delete Many Button */}
            {!!selectedProducts.length && (
              <button
                className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'
                onClick={() => setIsOpenConfirmModal(true)}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Delete Products'
        content='Are you sure that you want to delete these products?'
        onAccept={() => handleDeleteProducts(selectedProducts)}
        isLoading={loadingProducts.length > 0}
      />

      {/* Amount */}
      <div className='p-3 text-sm text-right text-white font-semibold'>
        {itemPerPage * +(searchParams?.page || 1) > amount
          ? amount
          : itemPerPage * +(searchParams?.page || 1)}
        /{amount} product{amount > 1 ? 's' : ''}
      </div>

      {/* MAIN LIST */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-21 lg:grid-cols-3'>
        {products.map(product => (
          <ProductItem
            data={product}
            loadingProducts={loadingProducts}
            // selected
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            // functions
            handleActivateProducts={handleActivateProducts}
            handleDeleteProducts={handleDeleteProducts}
            key={product._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllProductsPage
