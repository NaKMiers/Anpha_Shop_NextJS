import Link from 'next/link'
import React from 'react'
import { FaArrowLeft, FaPlus } from 'react-icons/fa'

interface AdminHeaderProps {
  title: string
  addLink?: string
  backLink?: string
  className?: string
}

function AdminHeader({ title, addLink, backLink, className = '' }: AdminHeaderProps) {
  return (
    <div className={`flex justify-center items-end mb-3 gap-3 ${className}`}>
      <Link
        className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-white hover:text-primary'
        href='/admin'>
        <FaArrowLeft />
        Admin
      </Link>
      <div className='py-2 px-3 text-light border border-slate-300 rounded-lg text-2xl text-center'>
        {title}
      </div>
      {backLink && (
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'
          href={backLink}>
          <FaArrowLeft />
          Back
        </Link>
      )}

      {addLink && (
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'
          href={addLink}>
          <FaPlus />
          Add
        </Link>
      )}
    </div>
  )
}

export default AdminHeader
