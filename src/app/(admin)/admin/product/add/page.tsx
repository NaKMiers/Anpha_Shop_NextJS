'use client'

import Link from 'next/link'
import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { FaArrowLeft } from 'react-icons/fa'

function AddAccountPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      productType: '',
      info: '',
      renewTime: '',
      day: '',
      hours: '',
      minutes: '',
      seconds: '',
      active: false,
    },
  })

  return (
    <div className='max-w-1200 mx-auto'>
      <div className='flex items-end mb-3 gap-3'>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-white hover:text-primary'
          href='/admin'>
          <FaArrowLeft />
          Admin
        </Link>
        <div className='py-2 px-3 text-light border border-slate-300 rounded-lg text-2xl'>
          All Accounts
        </div>
      </div>
    </div>
  )
}

export default AddAccountPage
