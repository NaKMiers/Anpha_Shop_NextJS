'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import CategoryItem from '@/components/admin/CategoryItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ICategory } from '@/models/CategoryModel'
import { deleteCategoriesApi, getAllCagetoriesApi, updateCategoriesApi } from '@/requests'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaFilter } from 'react-icons/fa'

export type EditingValues = {
  _id: string
  title: string
}

function AllCategoriesPage() {
  // store
  const dispatch = useAppDispatch()

  // states
  const [categories, setCategories] = useState<ICategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState<string[]>([])
  const [editingCategories, setEditingCategories] = useState<string[]>([])
  const [editingValues, setEditingValues] = useState<EditingValues[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // get all categories
  useEffect(() => {
    const getAllCategories = async () => {
      dispatch(setPageLoading(true))

      try {
        // sent request to server
        const { categories } = await getAllCagetoriesApi() // cache: no-store
        setCategories(categories)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        dispatch(setPageLoading(false))
      }
    }
    getAllCategories()
  }, [dispatch])

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

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Crtl + A
      if (event.ctrlKey && event.key === 'a') {
        event.preventDefault() // Prevent the default action
        setSelectedCategories(prev =>
          prev.length === categories.length ? [] : categories.map(category => category._id)
        )
      }

      // Delete
      if (event.key === 'Delete') {
        event.preventDefault() // Prevent the default action
        handleDeleteCategories(selectedCategories)
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [categories, selectedCategories, handleDeleteCategories])

  return (
    <div className='w-full'>
      <AdminHeader title='All Categories' addLink='/admin/category/add' />
      {/* <Pagination /> */}

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
              onChange={() => {}}
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

            {!!editingCategories.filter(id => selectedCategories.includes(id)).length && (
              <>
                {/* Save Many Button */}
                <button
                  className='border border-green-600 text-green-600 rounded-lg px-3 py-2 hover:bg-green-600 hover:text-light common-transition'
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

      <div className='pt-9' />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Delete Categories'
        content='Are you sure that you want to delete these categories?'
        onAccept={() => handleDeleteCategories(selectedCategories)}
        isLoading={loadingCategories.length > 0}
      />

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
