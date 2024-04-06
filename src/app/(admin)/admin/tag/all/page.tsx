'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import TagItem from '@/components/admin/TagItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ITag } from '@/models/TagModel'
import { deleteTagsApi, featureTagsApi, getAllTagsApi, updateTagsApi } from '@/requests'
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

function AllTagsPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // store
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [tags, setTags] = useState<ITag[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tgs, setTgs] = useState<ITag[]>([])
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([])

  const [editingValues, setEditingValues] = useState<EditingValues[]>([])

  // loading and confirming
  const [loadingTags, setLoadingTags] = useState<string[]>([])
  const [editingTags, setEditingTags] = useState<string[]>([])
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
    getValues,
    setValue,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      sort: 'updatedAt|-1',
      isFeatured: '',
    },
  })

  // get all tags
  useEffect(() => {
    // get all tags
    const getAllTags = async () => {
      // remove page
      const query = handleQuery(searchParams)
      console.log(query)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // sent request to server
        const { tags, amount, tgs } = await getAllTagsApi(query) // cache: no-store

        // set to states
        setTags(tags)
        setTgs(tgs)
        setAmount(amount)
        setSelectedFilterTags(
          [].concat((searchParams?._id || tgs.map((tag: ITag) => tag._id)) as []).map(type => type)
        )

        console.log('tgs: ', tgs)

        // get the product that have the min and max quantity
        const min = Math.min(...tgs.map((tag: ITag) => tag.productQuantity))
        const max = Math.max(...tgs.map((tag: ITag) => tag.productQuantity))

        setMinPQ(min)
        setMaxPQ(max)
        setProductQuantity(searchParams?.productQuantity ? +searchParams.productQuantity[0] : max)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllTags()
  }, [dispatch, searchParams])

  // delete tag
  const handleDeleteTags = useCallback(async (ids: string[]) => {
    setLoadingTags(ids)

    try {
      // senred request to server
      const { deletedTags, message } = await deleteTagsApi(ids)

      // remove deleted tags from state
      setTags(prev => prev.filter(tag => !deletedTags.map((tag: ITag) => tag._id).includes(tag._id)))

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingTags([])
      setSelectedTags([])
    }
  }, [])

  // feature tag
  const handleFeatureTags = useCallback(async (ids: string[], value: boolean) => {
    try {
      // senred request to server
      const { updatedTags, message } = await featureTagsApi(ids, value)
      console.log(updatedTags, message)

      // update tags from state
      setTags(prev =>
        prev.map(tag =>
          updatedTags.map((tag: ITag) => tag._id).includes(tag._id) ? { ...tag, isFeatured: value } : tag
        )
      )

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    }
  }, [])

  // handle submit edit tag
  const handleSaveEditingTags = useCallback(async (editingValues: any[]) => {
    setLoadingTags(editingValues.map(t => t._id))

    try {
      // senred request to server
      const { editedTags, message } = await updateTagsApi(editingValues)

      console.log('editedTags: ', editedTags)

      // update tags from state
      setTags(prev =>
        prev.map(t =>
          editedTags.map((t: ITag) => t._id).includes(t._id)
            ? editedTags.find((cat: ITag) => cat._id === t._id)
            : t
        )
      )
      setEditingTags(prev => prev.filter(id => !editedTags.map((t: any) => t._id).includes(id)))

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      setLoadingTags([])
    }
  }, [])

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    async data => {
      console.log(data)
      console.log({ ...searchParams, ...data, productQuantity, _id: selectedFilterTags })

      // handle query
      const query = handleQuery({
        ...searchParams,
        ...data,
        productQuantity: [productQuantity.toString()],
        _id: selectedFilterTags,
      })

      console.log(query)

      router.push(pathname + query)
    },
    [searchParams, productQuantity, selectedFilterTags, router, pathname]
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
        setSelectedTags(prev => (prev.length === tags.length ? [] : tags.map(category => category._id)))
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
  }, [tags, selectedTags, handleDeleteTags, handleFilter, handleSubmit, handleResetFilter])

  return (
    <div className='w-full'>
      {/* Top & Pagination */}
      <AdminHeader title='All Tags' addLink='/admin/tag/add' />
      <Pagination searchParams={searchParams} amount={amount} itemsPerPage={itemPerPage} />

      {/* Filter */}
      <div className='mt-8 bg-white self-end w-full rounded-medium shadow-md text-dark overflow-auto transition-all duration-300 no-scrollbar p-21 max-w-ful'>
        <div className='grid grid-cols-12 gap-21'>
          <div className='flex flex-col col-span-12 md:col-span-4'>
            <label htmlFor='productQuantity'>
              <span className='font-bold'>Product Quantity: </span>
              <span>{productQuantity || minPQ}</span> - <span>{maxPQ}</span>
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
                tgs.length === selectedFilterTags.length
                  ? 'bg-dark-100 text-white border-dark-100'
                  : 'border-slate-300'
              }`}
              title='All Types'
              onClick={() =>
                setSelectedFilterTags(
                  tgs.length === selectedFilterTags.length ? [] : tgs.map(category => category._id)
                )
              }>
              All
            </div>
            {tgs.map(category => (
              <div
                className={`overflow-hidden max-w-60 text-ellipsis text-nowrap p px-2 py-1 rounded-md border cursor-pointer select-none common-transition ${
                  selectedFilterTags.includes(category._id)
                    ? 'bg-secondary text-white border-secondary'
                    : 'border-slate-300'
                }`}
                title={category.title}
                key={category._id}
                onClick={
                  selectedFilterTags.includes(category._id)
                    ? () => setSelectedFilterTags(prev => prev.filter(id => id !== category._id))
                    : () => setSelectedFilterTags(prev => [...prev, category._id])
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

            {/* Featured */}
            <Input
              id='isFeatured'
              label='Featured'
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

          <div className='flex justify-end flex-wrap items-center gap-2 col-span-12'>
            {/* Select All Button */}
            <button
              className='border border-sky-400 text-sky-400 rounded-lg px-3 py-2 hover:bg-sky-400 hover:text-light common-transition'
              onClick={() => setSelectedTags(selectedTags.length > 0 ? [] : tags.map(tag => tag._id))}>
              {selectedTags.length > 0 ? 'Unselect All' : 'Select All'}
            </button>

            {!!editingTags.filter(id => selectedTags.includes(id)).length && (
              <>
                {/* Save Many Button */}
                <button
                  className='border border-green-600 text-green-600 rounded-lg px-3 py-2 hover:bg-green-600 hover:text-light common-transition'
                  onClick={() =>
                    handleSaveEditingTags(
                      editingValues.filter(value => selectedTags.includes(value._id))
                    )
                  }>
                  Save All
                </button>
                {/* Cancel Many Button */}
                <button
                  className='border border-slate-400 text-slate-400 rounded-lg px-3 py-2 hover:bg-slate-400 hover:text-light common-transition'
                  onClick={() => {
                    // cancel editing values are selected
                    setEditingTags(editingTags.filter(id => !selectedTags.includes(id)))
                    setEditingValues(editingValues.filter(value => !selectedTags.includes(value._id)))
                  }}>
                  Cancel
                </button>
              </>
            )}

            {/* Mark Many Button */}
            {!!selectedTags.length &&
              selectedTags.some(id => !tags.find(tag => tag._id === id)?.isFeatured) && (
                <button
                  className='border border-green-400 text-green-400 rounded-lg px-3 py-2 hover:bg-green-400 hover:text-light common-transition'
                  onClick={() => handleFeatureTags(selectedTags, true)}>
                  Mark
                </button>
              )}

            {/* Unmark Many Button */}
            {!!selectedTags.length &&
              selectedTags.some(id => tags.find(tag => tag._id === id)?.isFeatured) && (
                <button
                  className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'
                  onClick={() => handleFeatureTags(selectedTags, false)}>
                  Unmark
                </button>
              )}

            {/* Delete Many Button */}
            {!!selectedTags.length && (
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
        title='Delete Tags'
        content='Are you sure that you want to delete these tags?'
        onAccept={() => handleDeleteTags(selectedTags)}
        isLoading={loadingTags.length > 0}
      />

      {/* Amount */}
      <div className='p-3 text-sm text-right text-white font-semibold'>
        {itemPerPage * +(searchParams?.page || 1) > amount
          ? amount
          : itemPerPage * +(searchParams?.page || 1)}
        /{amount} tag{amount > 1 ? 's' : ''}
      </div>

      {/* MAIN (LIST) */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-21 lg:grid-cols-5'>
        {tags.map(tag => (
          <TagItem
            data={tag}
            loadingTags={loadingTags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            editingTags={editingTags}
            setEditingTags={setEditingTags}
            editingValues={editingValues}
            setEditingValues={setEditingValues}
            handleSaveEditingTags={handleSaveEditingTags}
            handleDeleteTags={handleDeleteTags}
            handleFeatureTags={handleFeatureTags}
            key={tag._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllTagsPage
