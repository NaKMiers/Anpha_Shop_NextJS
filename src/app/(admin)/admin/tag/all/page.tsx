'use client'

import Pagination from '@/components/Pagination'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/loadingReducer'
import { ITag } from '@/models/TagModel'
import axios from 'axios'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaCheck, FaFilter, FaPlus, FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'

function AllTagsPage() {
  const dispatch = useAppDispatch()
  const [tags, setTags] = useState<ITag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const [isShowFilter, setIsShowFilter] = useState(false)
  const [price, setPrice] = useState(9000)

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

  // get all tags
  useEffect(() => {
    const getAllTags = async () => {
      dispatch(setPageLoading(true))

      try {
        // sent request to server
        const res = await axios.get('/api/admin/tag/all')
        const { tags } = res.data
        setTags(tags)
      } catch (err: any) {
        console.log(err)
        toast.error(err.response.data.message)
      } finally {
        dispatch(setPageLoading(false))
      }
    }
    getAllTags()
  }, [dispatch])

  // delete tag
  const handleDeleteTags = useCallback(async (ids: string[]) => {
    try {
      // senred request to server
      const res = await axios.delete(`/api/admin/tag/delete`, { data: { ids } })
      const { deletedTags, message } = res.data

      // remove deleted tags from state
      setTags(prev => prev.filter(tag => !deletedTags.map((tag: ITag) => tag._id).includes(tag._id)))

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }, [])

  // feature tag
  const handleFeatureTags = useCallback(async (ids: string[], value: boolean) => {
    try {
      // senred request to server
      const res = await axios.post(`/api/admin/tag/feature`, { ids, value })
      const { updatedTags, message } = res.data
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
      toast.error(err.response.data.message)
    }
  }, [])

  const handleFilter = useCallback(() => {}, [])

  return (
    <div className='w-full'>
      <div className='flex items-end mb-3 gap-3'>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-white hover:text-primary'
          href='/admin'>
          <FaArrowLeft />
          Admin
        </Link>
        <div className='py-2 px-3 text-light border border-slate-300 rounded-lg text-2xl'>All Tags</div>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'
          href='/admin/tag/add'>
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
              <span className='font-bold'>Product Quantity: </span>
              <span>1</span> - <span>12</span>
            </label>
            <input
              className='input-range h-2 bg-slate-200 rounded-lg my-2'
              type='range'
              min='9000'
              max='2000000'
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
            />
          </div>
          <div className='flex justify-end items-center flex-wrap gap-3'>
            {/* Select */}
            Select
          </div>
          <div className='flex justify-end md:justify-start items-center'>
            <button
              className='group flex items-center text-nowrap bg-secondary text-[14px] font-semibold p-2 rounded-md cursor-pointer hover:bg-primary text-light hover:text-dark common-transition'
              onClick={handleFilter}>
              Lọc
              <FaFilter size={12} className='ml-1 text-light group-hover:text-dark common-transition' />
            </button>
          </div>

          <div className='flex justify-end items-center col-span-2 gap-2'>
            <button
              className='border border-sky-400 text-sky-400 rounded-lg px-3 py-2 hover:bg-sky-400 hover:text-light common-transition'
              onClick={() => setSelectedTags(selectedTags.length > 0 ? [] : tags.map(tag => tag._id))}>
              {selectedTags.length > 0 ? 'Unselect All' : 'Select All'}
            </button>
            <button
              className='border border-green-400 text-green-400 rounded-lg px-3 py-2 hover:bg-green-400 hover:text-light common-transition'
              onClick={() => handleFeatureTags(selectedTags, true)}>
              Mark
            </button>
            <button
              className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'
              onClick={() => handleFeatureTags(selectedTags, false)}>
              Unmark
            </button>
            <button
              className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'
              onClick={() => {
                handleDeleteTags(selectedTags)
              }}>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className='pt-9' />

      <div className='grid grid-cols-2 gap-21 lg:grid-cols-5'>
        {tags.map(tag => (
          <div
            className={`flex flex-col p-4 rounded-lg shadow-lg text-dark cursor-pointer common-transition ${
              selectedTags.includes(tag._id) ? 'bg-sky-100 scale-105' : 'bg-white'
            }`}
            key={tag.slug}
            onClick={() =>
              setSelectedTags(prev =>
                prev.includes(tag._id) ? prev.filter(id => id !== tag._id) : [...prev, tag._id]
              )
            }>
            <p className='font-semibold' title={tag.slug}>
              {tag.title}
            </p>
            <p className='font-semibold mb-2'>
              <span>Pr.Q:</span> <span className='text-primary'>{tag.productQuantity}</span>
            </p>

            <div className='flex self-end border border-dark rounded-lg px-3 py-2 gap-4'>
              <Link
                href='/admin/tag/:id/edit'
                className='block group'
                onClick={e => e.stopPropagation()}>
                <MdEdit size={18} className='group-hover:scale-125 common-transition' />
              </Link>
              <button
                className='block group'
                onClick={e => {
                  e.stopPropagation()
                  handleDeleteTags([tag._id])
                }}>
                <FaTrash size={18} className='group-hover:scale-125 common-transition' />
              </button>
              <button
                className='block group'
                title='isFeatured'
                onClick={e => {
                  e.stopPropagation()
                  handleFeatureTags([tag._id], !tag.isFeatured)
                }}>
                <FaCheck
                  size={18}
                  className={`group-hover:scale-125 common-transition ${
                    tag.isFeatured ? 'text-green-500' : 'text-slate-300'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllTagsPage
