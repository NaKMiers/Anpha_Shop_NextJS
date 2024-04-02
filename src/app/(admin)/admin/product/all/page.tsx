'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import ProductItem from '@/components/admin/ProductItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICategory } from '@/models/CategoryModel'
import { IProduct } from '@/models/ProductModel'
import { ITag } from '@/models/TagModel'
import { formatPrice } from '@/utils/formatNumber'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaFilter } from 'react-icons/fa'

export type ProductWithTagsAndCategory = IProduct & { tags: ITag[]; category: ICategory }

function AllProductsPage() {
  // hook
  const dispatch = useAppDispatch()

  // states
  const [products, setProducts] = useState<ProductWithTagsAndCategory[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [loadingProducts, setLoadingProducts] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // get all product
  useEffect(() => {
    const getAllProducts = async () => {
      dispatch(setPageLoading(true))

      try {
        // send request to server to get all products
        const res = await axios.get('/api/admin/product/all')

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

  // activate product
  const handleActivateProducts = useCallback(async (ids: string[], value: boolean) => {
    try {
      // senred request to server
      const res = await axios.post(`/api/admin/product/activate`, { ids, value })
      const { updatedProducts, message } = res.data
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
      toast.error(err.response.data.message)
    }
  }, [])

  // delete product
  const handleDeleteProducts = useCallback(async (ids: string[]) => {
    setLoadingProducts(ids)

    try {
      // senred request to server
      const res = await axios.delete(`/api/admin/product/delete`, { data: { ids } })
      const { deletedProducts, message } = res.data

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
      toast.error(err.response.data.message)
    } finally {
      setLoadingProducts([])
      setSelectedProducts([])
    }
  }, [])

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl + A
      if (event.ctrlKey && event.key === 'a') {
        event.preventDefault() // Prevent the default action
        setSelectedProducts(prev =>
          prev.length === products.length ? [] : products.map(product => product._id)
        )
      }

      // Delete
      if (event.key === 'Delete') {
        event.preventDefault() // Prevent the default action
        handleDeleteProducts(selectedProducts)
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [products, selectedProducts, handleDeleteProducts])

  return (
    <div className='w-full'>
      <AdminHeader title='All Products' addLink='/admin/product/add' />

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

      <div className='pt-9' />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Delete Products'
        content='Are you sure that you want to deleted these products?'
        onAccept={() => handleDeleteProducts(selectedProducts)}
        isLoading={loadingProducts.length > 0}
      />

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
