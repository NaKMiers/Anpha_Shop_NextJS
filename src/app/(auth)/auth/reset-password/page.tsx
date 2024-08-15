'use client'

import Input from '@/components/Input'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { resetPassword } from '@/requests'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaEyeSlash } from 'react-icons/fa'
import { FaCircleNotch } from 'react-icons/fa6'

function ResetPasswordPage() {
  // hooks
  const dispatch = useAppDispatch()
  const router = useRouter()
  const queryParams = useSearchParams()

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      newPassword: '',
      reNewPassword: '',
    },
  })

  useEffect(() => {
    // MARK: Check if token is not provided
    if (!queryParams.get('token')) {
      toast.error('Không có token')
      router.push('/auth/login')
    }
  }, [queryParams, router])

  // MARK: Reset Password Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      setIsLoading(true)

      try {
        // check if new password and re-new password are match
        if (data.newPassword !== data.reNewPassword) {
          setError('reNewPassword', { type: 'manual', message: 'Mật khẩu không khớp' }) // add this line
          return
        }

        // get email and token from query
        const token = queryParams.get('token')

        // send request to server
        const { message } = await resetPassword(token!, data.newPassword)

        // show success message
        toast.success(message)

        // redirect to login page
        router.push('/auth/login')
      } catch (err: any) {
        // show error message
        toast.error(err.message)
        console.log(err)
      } finally {
        // reset loading state
        setIsLoading(false)
      }
    },
    [setError, router, queryParams]
  )

  // keyboard event
  useEffect(() => {
    dispatch(setPageLoading(false))

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit(onSubmit)()
      }
    }

    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [dispatch, handleSubmit, onSubmit])

  return (
    <div className='relative w-full min-h-screen'>
      <div className='bg-white pb-10 max-w-[500px] w-full py-21 px-8 rounded-medium shadow-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <h1 className='text-secondary text-[40px] font-semibold tracking-wide font-body mb-4'>
          Đặt lại mật khẩu
        </h1>

        <Input
          id='newPassword'
          label='Mật khẩu mới'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='password'
          icon={FaEyeSlash}
          className='mb-5'
          onFocus={() => clearErrors('newPassword')}
        />

        <Input
          id='reNewPassword'
          label='Nhập lại mật khẩu mới'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='password'
          icon={FaEyeSlash}
          className='mb-5'
          onFocus={() => clearErrors('reNewPassword')}
        />

        <div className='flex justify-end mb-3 -mt-3'>
          <a href='/auth/login' className='text-dark underline hover:text-sky-600 common-transitio'>
            Quay lại đăng nhập
          </a>
        </div>

        <div className='flex items-center justify-end gap-3'>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className={`h-[40px] min-w-[48px] flex items-center justify-center group bg-secondary rounded-lg py-2 px-3 text-white hover:bg-primary hover:text-dark common-transition font-semibold ${
              isLoading ? 'bg-slate-200 pointer-events-none' : ''
            }`}
          >
            {isLoading ? (
              <FaCircleNotch
                size={18}
                className='text-white group-hover:text-dark common-transition animate-spin'
              />
            ) : (
              'Đặt lại'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
