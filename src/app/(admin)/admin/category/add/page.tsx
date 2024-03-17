'use client'

import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/loadingReducer'
import axios from 'axios'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaArrowLeft } from 'react-icons/fa'
import { RiCharacterRecognitionLine } from 'react-icons/ri'

function AddCategoryPage() {
  // store
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.loading.isLoading)

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      title: '',
    },
  })

  // add new tag
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      dispatch(setLoading(true))

      console.log(data)
      try {
        // add new tag login here
        const res = await axios.post('/api/admin/category/add', data)

        // show success message
        toast.success(res.data.message)

        // clear form
        reset()
      } catch (err: any) {
        toast.error(err.response.data.message)
        console.log(err)
      } finally {
        dispatch(setLoading(false))
      }
    },
    [dispatch, reset]
  )

  // Enter key to submit
  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleSubmit(onSubmit)()
    }

    window.addEventListener('keydown', handleEnter)
    return () => window.removeEventListener('keydown', handleEnter)
  }, [handleSubmit, onSubmit])

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
          Add Category
        </div>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'
          href='/admin/category/all'>
          <FaArrowLeft />
          Back
        </Link>
      </div>

      <div className='pt-5' />

      <div>
        <Input
          id='title'
          label='Title'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='text'
          icon={RiCharacterRecognitionLine}
          className='mb-5'
        />

        <LoadingButton
          className='px-4 py-2 bg-secondary hover:bg-primary text-light rounded-lg font-semibold common-transition'
          onClick={handleSubmit(onSubmit)}
          text='Add'
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default AddCategoryPage
