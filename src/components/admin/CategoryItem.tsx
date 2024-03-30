import { ICategory } from '@/models/CategoryModel'
import React from 'react'
import { FaSave, FaTrash } from 'react-icons/fa'
import { MdCancel, MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'

interface CategoryItemProps {
  data: ICategory
  loadingCategories: string[]
  className?: string

  selectedCategories: string[]
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>

  editingCategories: string[]
  setEditingCategories: React.Dispatch<React.SetStateAction<string[]>>

  editingValues: { _id: string; title: string }[]
  setEditingValues: React.Dispatch<React.SetStateAction<{ _id: string; title: string }[]>>

  handleSaveEditingCategories: (editingValues: { _id: string; value: string }[]) => void
  handleDeleteCategories: (ids: string[]) => void
}

function CategoryItem({
  data,
  loadingCategories,
  className = '',
  // selected
  selectedCategories,
  setSelectedCategories,
  // editing
  editingCategories,
  setEditingCategories,
  // values
  editingValues,
  setEditingValues,
  // functions
  handleSaveEditingCategories,
  handleDeleteCategories,
}: CategoryItemProps) {
  return (
    <div
      className={`flex flex-col p-4 rounded-lg shadow-lg text-dark cursor-pointer common-transition ${
        selectedCategories.includes(data._id) ? 'bg-sky-100 scale-105' : 'bg-white'
      } ${className}`}
      onClick={() =>
        setSelectedCategories(prev =>
          prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
        )
      }
      key={data._id}>
      {editingCategories.includes(data._id) ? (
        // Category Title Input
        <input
          className='w-full mb-2 rounded-lg py-2 px-4 text-dark outline-none border border-slate-300'
          type='text'
          value={editingValues.find(cate => cate._id === data._id)?.title}
          onClick={e => e.stopPropagation()}
          disabled={loadingCategories.includes(data._id)}
          onChange={e =>
            setEditingValues(prev =>
              prev.map(cate =>
                cate._id === data._id ? { _id: data._id, title: e.target.value.trim() } : cate
              )
            )
          }
        />
      ) : (
        // Category Title
        <p className='font-semibold' title={data.slug}>
          {data.title}
        </p>
      )}

      {/* Product Quantity */}
      <p className='font-semibold mb-2' title={`Product Quantity: ${data.productQuantity}`}>
        <span>Pr.Q:</span> <span className='text-primary'>{data.productQuantity}</span>
      </p>

      <div className='flex self-end border overflow-x-auto max-w-full border-dark rounded-lg px-3 py-2 gap-4'>
        {/* Edit Button */}
        {!editingCategories.includes(data._id) && (
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              setEditingCategories(prev => (!prev.includes(data._id) ? [...prev, data._id] : prev))
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
        {editingCategories.includes(data._id) && (
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              handleSaveEditingCategories([editingValues.find(cate => cate._id === data._id)] as any[])
            }}
            disabled={loadingCategories.includes(data._id)}>
            {loadingCategories.includes(data._id) ? (
              <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
            ) : (
              <FaSave size={18} className='group-hover:scale-125 common-transition text-green-600' />
            )}
          </button>
        )}

        {/* Cancel Button */}
        {editingCategories.includes(data._id) && !loadingCategories.includes(data._id) && (
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              setEditingCategories(prev =>
                prev.includes(data._id) ? prev.filter(id => id !== data._id) : prev
              )
              setEditingValues(prev => prev.filter(cate => cate._id !== data._id))
            }}>
            <MdCancel size={20} className='group-hover:scale-125 common-transition text-slate-300' />
          </button>
        )}

        {/* Delete Button */}
        {!editingCategories.includes(data._id) && (
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              handleDeleteCategories([data._id])
            }}
            disabled={loadingCategories.includes(data._id)}>
            {loadingCategories.includes(data._id) ? (
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

export default CategoryItem
