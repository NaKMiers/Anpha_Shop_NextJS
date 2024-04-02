'use client'

import ConfirmDialog from '@/components/ConfirmDialog'
import Pagination from '@/components/Pagination'
import AdminHeader from '@/components/admin/AdminHeader'
import TagItem from '@/components/admin/TagItem'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { ITag } from '@/models/TagModel'
import axios from 'axios'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaFilter, FaPlus } from 'react-icons/fa'

type EditingValues = {
  _id: string
  title: string
}

function AllTagsPage() {
  // hook
  const dispatch = useAppDispatch()

  // states
  const [tags, setTags] = useState<ITag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const [editingTags, setEditingTags] = useState<string[]>([])
  const [loadingTags, setLoadingTags] = useState<string[]>([])
  const [editingValues, setEditingValues] = useState<EditingValues[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

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
    setLoadingTags(ids)

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
    } finally {
      setLoadingTags([])
      setSelectedTags([])
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

  // handle submit edit tag
  const handleSaveEditingTags = useCallback(async (editingValues: any[]) => {
    setLoadingTags(editingValues.map(t => t._id))

    try {
      // senred request to server
      const res = await axios.put(`/api/admin/tag/edit`, { editingValues })
      const { editedTags, message } = res.data

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
      toast.error(err.response.data.message)
    } finally {
      setLoadingTags([])
    }
  }, [])

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Crtl + A
      if (event.ctrlKey && event.key === 'a') {
        event.preventDefault() // Prevent the default action
        setSelectedTags(prev => (prev.length === tags.length ? [] : tags.map(tag => tag._id)))
      }

      // Delete
      if (event.key === 'Delete') {
        event.preventDefault() // Prevent the default aconti
        handleDeleteTags(selectedTags)
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [tags, selectedTags, handleDeleteTags])

  return (
    <div className='w-full'>
      <AdminHeader title='All Tags' addLink='/admin/tag/add' />

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

          {/* Select Filter */}
          <div className='flex justify-end items-center flex-wrap gap-3'>Select</div>

          {/* Filter Button */}
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

      <div className='pt-9' />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Delete Tags'
        content='Are you sure that you want to deleted these tags?'
        onAccept={() => handleDeleteTags(selectedTags)}
        isLoading={loadingTags.length > 0}
      />

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
