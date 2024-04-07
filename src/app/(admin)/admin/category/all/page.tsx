'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import CategoryItem from '@/components/admin/CategoryItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICategory } from '@/models/CategoryModel'
import { deleteCategoriesApi, getAllCagetoriesApi, updateCategoriesApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BiReset } from 'react-icons/bi'
import { FaFilter, FaSort } from 'react-icons/fa'

export type EditingValues = {
  _id: string
  title: string
}

function AllCategoriesPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [categories, setCategories] = useState<ICategory[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [cates, setCates] = useState<ICategory[]>([])
  const [selectedFilterCategories, setSelectedFilterCategories] = useState<string[]>([])

  const [editingValues, setEditingValues] = useState<EditingValues[]>([])

  // loading and confirming
  const [loadingCategories, setLoadingCategories] = useState<string[]>([])
  const [editingCategories, setEditingCategories] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 10
  const [minPQ, setMinPQ] = useState<number>(0)
  const [maxPQ, setMaxPQ] = useState<number>(0)
  const [productQuantity, setProductQuantity] = useState<number>(0)

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      sort: 'updatedAt|-1',
    },
  })

  // get all categories
  useEffect(() => {
    // get all categories
    const getAllCategories = async () => {
      const query = handleQuery(searchParams)
      console.log(query)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // sent request to server
        const { categories, amount, cates } = await getAllCagetoriesApi(query) // cache: no-store

        console.log(cates)

        // set to states
        setCategories(categories)
        setCates(cates)
        setAmount(amount)
        setSelectedFilterCategories(
          []
            .concat((searchParams?._id || cates.map((cate: ICategory) => cate._id)) as [])
            .map(type => type)
        )

        // get the product that have the min and max quantity
        const min = Math.min(...cates.map((cate: ICategory) => cate.productQuantity))
        const max = Math.max(...cates.map((cate: ICategory) => cate.productQuantity))

        setMinPQ(min)
        setMaxPQ(max)
        setProductQuantity(searchParams?.productQuantity ? +searchParams.productQuantity : max)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllCategories()
  }, [dispatch, searchParams, setValue])

  // delete category
  const handleDeleteCategories = useCallback(async (ids: string[]) => {
    setLoadingCategories(ids)

    try {
      // senred request to server
      const { deletedCategories, message } = await deleteCategoriesApi(ids)

      // remove deleted tags from state
      setCategories(prev =>
        prev.filter(
          category =>
            !deletedCategories.map((category: ICategory) => category._id).includes(category._id)
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingCategories([])
      setSelectedCategories([])
    }
  }, [])

  // handle submit edit category
  const handleSaveEditingCategories = useCallback(async (editingValues: any[]) => {
    setLoadingCategories(editingValues.map(cate => cate._id))

    try {
      // send request to server
      const { editedCategories, message } = await updateCategoriesApi(editingValues)
      console.log('editedCategories: ', editedCategories)

      // update categories from state
      setCategories(prev =>
        prev.map(cate =>
          editedCategories.map((cate: ICategory) => cate._id).includes(cate._id)
            ? editedCategories.find((cat: ICategory) => cat._id === cate._id)
            : cate
        )
      )
      setEditingCategories(prev =>
        prev.filter(id => !editedCategories.map((cate: any) => cate._id).includes(id))
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingCategories([])
      setSelectedCategories([])
    }
  }, [])

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    async data => {
      console.log(data)
      console.log({ ...searchParams, ...data, productQuantity, _id: selectedFilterCategories })

      // handle query
      const query = handleQuery({
        ...searchParams,
        ...data,
        productQuantity: [productQuantity.toString()],
        _id: selectedFilterCategories,
      })

      console.log(query)

      router.push(pathname + query)
    },
    [searchParams, productQuantity, selectedFilterCategories, router, pathname]
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
        setSelectedCategories(prev =>
          prev.length === categories.length ? [] : categories.map(category => category._id)
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
  }, [
    categories,
    selectedCategories,
    handleDeleteCategories,
    handleFilter,
    handleSubmit,
    handleResetFilter,
  ])

  return (
    <div className='w-full'>
      {/* Top & Pagination */}
      <AdminHeader title='All Categories' addLink='/admin/category/add' />
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      {/* Filter */}
      <div className='mt-8 bg-white self-end w-full rounded-medium shadow-md text-dark overflow-auto transition-all duration-300 no-scrollbar p-21 max-w-ful'>
        <div className='grid grid-cols-12 gap-21'>
          <div className='flex flex-col col-span-12 md:col-span-4'>
            <label htmlFor='productQuantity'>
              <span className='font-bold'>Product Quantity: </span>
              <span>{productQuantity || maxPQ}</span> - <span>{maxPQ}</span>
            </label>
            <input
              id='productQuantity'
              className='input-range h-2 bg-slate-200 rounded-lg my-2'
              placeholder=' '
              disabled={false}
              type='range'
              min={minPQ || 0}
              max={maxPQ || 0}
              value={productQuantity}
              onChange={e => setProductQuantity(+e.target.value)}
            />
          </div>

          {/* Cate Selection */}
          <div className='flex justify-end items-end gap-1 flex-wrap max-h-[186px] md:max-h-[148px] lg:max-h-[110px] overflow-auto col-span-12 md:col-span-8'>
            <div
              className={`overflow-hidden max-w-60 text-ellipsis text-nowrap p px-2 py-1 rounded-md border cursor-pointer select-none common-transition ${
                cates.length === selectedFilterCategories.length
                  ? 'bg-dark-100 text-white border-dark-100'
                  : 'border-slate-300'
              }`}
              title='All Types'
              onClick={() =>
                setSelectedFilterCategories(
                  cates.length === selectedFilterCategories.length
                    ? []
                    : cates.map(category => category._id)
                )
              }>
              All
            </div>
            {cates.map(category => (
              <div
                className={`overflow-hidden max-w-60 text-ellipsis text-nowrap p px-2 py-1 rounded-md border cursor-pointer select-none common-transition ${
                  selectedFilterCategories.includes(category._id)
                    ? 'bg-secondary text-white border-secondary'
                    : 'border-slate-300'
                }`}
                title={category.title}
                key={category._id}
                onClick={
                  selectedFilterCategories.includes(category._id)
                    ? () => setSelectedFilterCategories(prev => prev.filter(id => id !== category._id))
                    : () => setSelectedFilterCategories(prev => [...prev, category._id])
                }>
                {category.title}
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

          {/* Acction Buttons */}
          <div className='flex justify-end flex-wrap items-center gap-2 col-span-12'>
            {/* Select All Button */}
            <button
              className='border border-sky-400 text-sky-400 rounded-lg px-3 py-2 hover:bg-sky-400 hover:text-light common-transition'
              onClick={() =>
                setSelectedCategories(
                  selectedCategories.length > 0 ? [] : categories.map(tag => tag._id)
                )
              }>
              {selectedCategories.length > 0 ? 'Unselect All' : 'Select All'}
            </button>

            {!!editingCategories.filter(id => selectedCategories.includes(id)).length && (
              <>
                {/* Save Many Button */}
                <button
                  className='border border-green-500 text-green-500 rounded-lg px-3 py-2 hover:bg-green-500 hover:text-light common-transition'
                  onClick={() =>
                    handleSaveEditingCategories(
                      editingValues.filter(value => selectedCategories.includes(value._id))
                    )
                  }>
                  Save All
                </button>

                {/* Cancel Many Button */}
                <button
                  className='border border-slate-400 text-slate-400 rounded-lg px-3 py-2 hover:bg-slate-400 hover:text-light common-transition'
                  onClick={() => {
                    // cancel editing values are selected
                    setEditingCategories(
                      editingCategories.filter(id => !selectedCategories.includes(id))
                    )
                    setEditingValues(
                      editingValues.filter(value => !selectedCategories.includes(value._id))
                    )
                  }}>
                  Cancel
                </button>
              </>
            )}

            {/* Delete Many Button */}
            {!!selectedCategories.length && (
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
        title='Delete Categories'
        content='Are you sure that you want to delete these categories?'
        onAccept={() => handleDeleteCategories(selectedCategories)}
        isLoading={loadingCategories.length > 0}
      />

      {/* Amount */}
      <div className='p-3 text-sm text-right text-white font-semibold'>
        {itemPerPage * +(searchParams?.page || 1) > amount
          ? amount
          : itemPerPage * +(searchParams?.page || 1)}
        /{amount} {amount > 1 ? 'categories' : 'category'}
      </div>

      {/* Category List */}
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-21'>
        {categories.map(category => (
          <CategoryItem
            data={category}
            loadingCategories={loadingCategories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            editingCategories={editingCategories}
            setEditingCategories={setEditingCategories}
            editingValues={editingValues}
            setEditingValues={setEditingValues}
            handleSaveEditingCategories={handleSaveEditingCategories}
            handleDeleteCategories={handleDeleteCategories}
            key={category._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllCategoriesPage
