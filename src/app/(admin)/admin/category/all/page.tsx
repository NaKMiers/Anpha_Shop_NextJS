'use client'

import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading, setPageLoading } from '@/libs/reducers/loadingReducer'
import { ICategory } from '@/models/CategoryModel'
import { Menu, MenuItem } from '@mui/material'
import axios from 'axios'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaCaretDown, FaCheck, FaFilter, FaPlus, FaSave, FaTrash } from 'react-icons/fa'
import { FaCircleUser } from 'react-icons/fa6'
import { MdCancel, MdEdit, MdTextFormat } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'

type EditingValues = {
  _id: string
  value: string
}

function AllCategoriesPage() {
  const dispatch = useAppDispatch()
  const [categories, setCategories] = useState<ICategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [editingCategories, setEditingCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState<string[]>([])
  const [editingValues, setEditingValues] = useState<EditingValues[]>([])

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

  console.log(editingValues)

  // handle submit edit category
  const handleSaveEditingCategories = useCallback(async (editingValues: any[]) => {
    setLoadingCategories(editingValues.map(cate => cate._id))

    try {
      // senred request to server
      const res = await axios.put(`/api/admin/category/edit`, { editingValues })
      const { editedCategories, message } = res.data

      console.log(
        'editedCategories: ',
        editedCategories.map((cate: any) => cate._id)
      )

      // update categories from state
      setCategories(prev =>
        prev.map(cate =>
          editedCategories.map((cate: any) => cate._id).includes(cate._id)
            ? editedCategories.find((cat: any) => cat._id === cate._id)
            : prev
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
                  Save
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
          <div
            className={`flex flex-col p-4 rounded-lg shadow-lg text-dark cursor-pointer common-transition ${
              selectedCategories.includes(category._id) ? 'bg-sky-100 scale-105' : 'bg-white'
            }`}
            onClick={() =>
              setSelectedCategories(prev =>
                prev.includes(category._id)
                  ? prev.filter(id => id !== category._id)
                  : [...prev, category._id]
              )
            }
            key={category.slug}>
            {editingCategories.includes(category._id) ? (
              <input
                className='w-full mb-2 rounded-lg py-2 px-4 text-dark outline-none border border-slate-300'
                type='text'
                value={editingValues.find(cate => cate._id === category._id)?.value}
                onClick={e => e.stopPropagation()}
                disabled={loadingCategories.includes(category._id)}
                onChange={e =>
                  setEditingValues(prev =>
                    prev.map(cate =>
                      cate._id === category._id
                        ? { _id: category._id, value: e.target.value.trim() }
                        : cate
                    )
                  )
                }
              />
            ) : (
              <p className='font-semibold' title={category.slug}>
                {category.title}
              </p>
            )}

            <p className='font-semibold mb-2'>
              <span>Pr.Q:</span> <span className='text-primary'>{category.productQuantity}</span>
            </p>

            <div className='flex self-end border overflow-x-auto max-w-full border-dark rounded-lg px-3 py-2 gap-4'>
              {/* Edit Button */}
              {!editingCategories.includes(category._id) && (
                <button
                  className='block group'
                  onClick={e => {
                    e.stopPropagation()
                    setEditingCategories(prev =>
                      !prev.includes(category._id) ? [...prev, category._id] : prev
                    )
                    setEditingValues(prev =>
                      !prev.some(cate => cate._id === category._id)
                        ? [...prev, { _id: category._id, value: category.title }]
                        : prev
                    )
                  }}>
                  <MdEdit size={18} className='group-hover:scale-125 common-transition' />
                </button>
              )}
              {/* Save Button */}
              {editingCategories.includes(category._id) && (
                <button
                  className='block group'
                  onClick={e => {
                    e.stopPropagation()
                    handleSaveEditingCategories([editingValues.find(cate => cate._id === category._id)])
                  }}
                  disabled={loadingCategories.includes(category._id)}>
                  {loadingCategories.includes(category._id) ? (
                    <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
                  ) : (
                    <FaSave
                      size={18}
                      className='group-hover:scale-125 common-transition text-green-500'
                    />
                  )}
                </button>
              )}
              {/* Cancel Button */}
              {editingCategories.includes(category._id) && !loadingCategories.includes(category._id) && (
                <button
                  className='block group'
                  onClick={e => {
                    e.stopPropagation()
                    setEditingCategories(prev =>
                      prev.includes(category._id) ? prev.filter(id => id !== category._id) : prev
                    )
                    setEditingValues(prev => prev.filter(cate => cate._id !== category._id))
                  }}>
                  <MdCancel
                    size={20}
                    className='group-hover:scale-125 common-transition text-slate-300'
                  />
                </button>
              )}
              {/* Delete Button */}
              {!editingCategories.includes(category._id) && (
                <button
                  className='block group'
                  onClick={e => {
                    e.stopPropagation()
                    handleDeleteCategories([category._id])
                  }}
                  disabled={loadingCategories.includes(category._id)}>
                  {loadingCategories.includes(category._id) ? (
                    <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
                  ) : (
                    <FaTrash size={18} className='group-hover:scale-125 common-transition' />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllCategoriesPage
