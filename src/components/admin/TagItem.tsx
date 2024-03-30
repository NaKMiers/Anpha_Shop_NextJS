import { ITag } from '@/models/TagModel'
import Link from 'next/link'
import React from 'react'
import { FaCheck, FaSave, FaTrash } from 'react-icons/fa'
import { MdCancel, MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'

interface TagItemProps {
  data: ITag
  loadingTags: string[]
  className?: string

  selectedTags: string[]
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>

  editingTags: string[]
  setEditingTags: React.Dispatch<React.SetStateAction<string[]>>

  editingValues: { _id: string; title: string }[]
  setEditingValues: React.Dispatch<React.SetStateAction<{ _id: string; title: string }[]>>

  handleSaveEditingTags: (editingValues: { _id: string; value: string }[]) => void
  handleDeleteTags: (ids: string[]) => void
  handleFeatureTags: (ids: string[], isFeatured: boolean) => void
}

function TagItem({
  data,
  loadingTags,
  className = '',
  // selected
  selectedTags,
  setSelectedTags,
  // editing
  editingTags,
  setEditingTags,
  // values
  editingValues,
  setEditingValues,
  // functions
  handleSaveEditingTags,
  handleDeleteTags,
  handleFeatureTags,
}: TagItemProps) {
  return (
    <div
      className={`flex flex-col p-4 rounded-lg shadow-lg text-dark cursor-pointer common-transition ${
        selectedTags.includes(data._id) ? 'bg-sky-100 scale-105' : 'bg-white'
      } ${className}`}
      key={data._id}
      onClick={() =>
        setSelectedTags(prev =>
          prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
        )
      }>
      {editingTags.includes(data._id) ? (
        // Tag Title Input
        <input
          className='w-full mb-2 rounded-lg py-2 px-4 text-dark outline-none border border-slate-300'
          type='text'
          value={editingValues.find(t => t._id === data._id)?.title}
          onClick={e => e.stopPropagation()}
          disabled={loadingTags.includes(data._id)}
          onChange={e =>
            setEditingValues(prev =>
              prev.map(t => (t._id === data._id ? { _id: data._id, title: e.target.value.trim() } : t))
            )
          }
        />
      ) : (
        // Tag Title
        <p className='font-semibold' title={data.slug}>
          {data.title}
        </p>
      )}

      {/* Product Quantity */}
      <p className='font-semibold mb-2' title={`Product Quantity: ${data.productQuantity}`}>
        <span>Pr.Q:</span> <span className='text-primary'>{data.productQuantity}</span>
      </p>

      <div className='flex self-end border border-dark rounded-lg px-3 py-2 gap-4'>
        {/* Feature Button */}
        {!editingTags.includes(data._id) && (
          <button
            className='block group'
            title='isFeatured'
            onClick={e => {
              e.stopPropagation()
              handleFeatureTags([data._id], !data.isFeatured)
            }}
            disabled={loadingTags.includes(data._id)}>
            <FaCheck
              size={18}
              className={`group-hover:scale-125 common-transition ${
                data.isFeatured ? 'text-green-600' : 'text-slate-300'
              }`}
            />
          </button>
        )}

        {/* Edit Button */}
        {!editingTags.includes(data._id) && (
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              setEditingTags(prev => (!prev.includes(data._id) ? [...prev, data._id] : prev))
              setEditingValues(prev =>
                !prev.some(cate => cate._id === data._id)
                  ? [...prev, { _id: data._id, title: data.title }]
                  : prev
              )
            }}>
            <MdEdit size={18} className='group-hover:scale-125 common-transition' />
          </button>
        )}

        {/* Save Button */}
        {editingTags.includes(data._id) && (
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              handleSaveEditingTags([editingValues.find(cate => cate._id === data._id)] as any[])
            }}
            disabled={loadingTags.includes(data._id)}>
            {loadingTags.includes(data._id) ? (
              <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
            ) : (
              <FaSave size={18} className='group-hover:scale-125 common-transition text-green-600' />
            )}
          </button>
        )}

        {/* Cancel Button */}
        {editingTags.includes(data._id) && !loadingTags.includes(data._id) && (
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              setEditingTags(prev =>
                prev.includes(data._id) ? prev.filter(id => id !== data._id) : prev
              )
              setEditingValues(prev => prev.filter(cate => cate._id !== data._id))
            }}>
            <MdCancel size={20} className='group-hover:scale-125 common-transition text-slate-300' />
          </button>
        )}

        {/* Delete Button */}
        {!editingTags.includes(data._id) && (
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              handleDeleteTags([data._id])
            }}
            disabled={loadingTags.includes(data._id)}>
            {loadingTags.includes(data._id) ? (
              <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
            ) : (
              <FaTrash size={18} className='group-hover:scale-125 common-transition' />
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default TagItem
