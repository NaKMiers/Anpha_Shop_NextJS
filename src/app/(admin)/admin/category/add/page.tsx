'use client'

import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/modalReducer'
import { addCategoryApi } from '@/requests'
import { useCallback, useEffect } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { RiCharacterRecognitionLine } from 'react-icons/ri'

function AddCategoryPage() {
  // store
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      title: '',
    },
  })

  // MARK: Submit
  // add new category
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      dispatch(setLoading(true))

      try {
        // add new category here
        const { message } = await addCategoryApi(data)

        // show success message
        toast.success(message)

        // clear form
        reset()
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
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
      {/* MARK: Admin Header */}
      <AdminHeader title='Add Category' backLink='/admin/category/all' />

      {/* MARK: Body */}
      <div className='mt-5'>
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
          onFocus={() => clearErrors('title')}
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
