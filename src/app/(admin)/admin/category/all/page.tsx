'use client'

import Pagination from '@/components/Pagination'
import CategoryItem from '@/components/admin/CategoryItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/loadingReducer'
import { ICategory } from '@/models/CategoryModel'
import axios from 'axios'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaFilter, FaPlus } from 'react-icons/fa'

type EditingValues = {
  _id: string
  title: string
}

function AllCategoriesPage() {
  const dispatch = useAppDispatch()
  const [categories, setCategories] = useState<ICategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [editingCategories, setEditingCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState<string[]>([])
  const [editingValues, setEditingValues] = useState<EditingValues[]>([])

  // get all categories
  useEffect(() => {
    const getAllTags = async () => {
      dispatch(setPageLoading(true))

      try {
        // sent request to server
        const res = await axios.get('/api/admin/category/all')
        const { categories } = res.data
        setCategories(categories)
      } catch (err: any) {
        console.log(err)
        toast.error(err.response.data.message)
      } finally {
        dispatch(setPageLoading(false))
      }
    }
    getAllTags()
  }, [dispatch])

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'a') {
        event.preventDefault() // Prevent the default action
        setSelectedCategories(prev =>
          prev.length === categories.length ? [] : categories.map(category => category._id)
        )
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [categories])

  // delete category
  const handleDeleteCategories = useCallback(async (ids: string[]) => {
    setLoadingCategories(ids)

    try {
      // senred request to server
      const res = await axios.delete(`/api/admin/category/delete`, { data: { ids } })
      const { deletedCategories, message } = res.data

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
      toast.error(err.response.data.message)
    } finally {
      setLoadingCategories([])
    }
  }, [])

  // handle submit edit category
  const handleSaveEditingCategories = useCallback(async (editingValues: any[]) => {
    setLoadingCategories(editingValues.map(cate => cate._id))

    try {
      // senred request to server
      const res = await axios.put(`/api/admin/category/edit`, { editingValues })
      const { editedCategories, message } = res.data

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
      toast.error(err.response.data.message)
    } finally {
      setLoadingCategories([])
    }
  }, [])

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
          All Categories
        </div>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'
          href='/admin/category/add'>
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
              value={9000}
            />
          </div>
          <div className='flex justify-end items-center flex-wrap gap-3'>
            {/* Select */}
            Select
          </div>
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
                setSelectedCategories(
                  selectedCategories.length > 0 ? [] : categories.map(tag => tag._id)
                )
              }>
              {selectedCategories.length > 0 ? 'Unselect All' : 'Select All'}
            </button>
            {editingCategories.length ? (
              <>
                {/* Save Many Button */}
                <button
                  className='border border-green-500 text-green-500 rounded-lg px-3 py-2 hover:bg-green-500 hover:text-light common-transition'
                  onClick={() => handleSaveEditingCategories(editingValues)}>
                  Save All
                </button>
                {/* Cancel Many Button */}
                <button
                  className='border border-slate-400 text-slate-400 rounded-lg px-3 py-2 hover:bg-slate-400 hover:text-light common-transition'
                  onClick={() => {
                    setEditingCategories([])
                    setEditingValues([])
                  }}>
                  Cancel
                </button>
              </>
            ) : null}
            {/* Delete Many Button */}
            <button
              className='border border-red-500 text-red-500 rounded-lg px-3 py-2 hover:bg-red-500 hover:text-light common-transition'
              onClick={() => {
                handleDeleteCategories(selectedCategories)
              }}>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className='pt-9' />

      {/* Category List */}
      <div className='grid grid-cols-2 gap-21 lg:grid-cols-5'>
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
