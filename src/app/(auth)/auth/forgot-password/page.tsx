'use client'

import Input from '@/components/Input'
import { forgotPasswordApi } from '@/requests'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'

const time = 60

function ForgotPasswordPage() {
  // states
  const [isSent, setIsSent] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCounting, setIsCounting] = useState<boolean>(false)
  const [countDown, setCountDown] = useState<number>(time)

  useEffect(() => {
    if (isSent) {
      setIsCounting(true)
      const interval = setInterval(() => {
        if (countDown === 0) {
          // reset
          clearInterval(interval)
          setIsCounting(false)
          setIsSent(false)
          setCountDown(time)
          return
        }
        setCountDown(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isSent, countDown])

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
    },
  })

  // MARK: Forgot Password Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      setIsLoading(true)

      try {
        // send request to server
        const { message } = await forgotPasswordApi(data)

        // show success message
        toast.success(message)

        // set is sent
        setIsSent(true)
      } catch (err: any) {
        // show error message
        console.log(err)
        const { message } = err
        setError('email', { type: 'manual', message: message })
        toast.error(message)
      } finally {
        // reset loading state
        setIsLoading(false)
      }
    },
    [setError]
  )

  // keyboard event
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit(onSubmit)()
      }
    }

    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [handleSubmit, onSubmit])

  return (
    <div className='relative w-full min-h-screen'>
      <div className='bg-white pb-10 max-w-[500px] w-full py-21 px-8 rounded-medium shadow-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <h1 className='text-secondary text-[40px] font-semibold tracking-wide font-body mb-4'>
          Quên Mật Khẩu
        </h1>

        <p className='mb-1.5 font-body tracking-wider text-sm italic text-slate-500'>
          *Vui lòng nhập email để nhận mã khôi phục mật khẩu.
        </p>

        {isSent && isCounting ? (
          <div className='flex items-center justify-between gap-3 mb-3'>
            <div className='flex items-center gap-2 border border-slate-300 py-2 px-3 rounded-lg'>
              {countDown ? <FaCircleNotch size={20} className='text-slate-300 animate-spin' /> : ''}
              <span className='text-slate-400 text-nowrap'>{countDown > 0 ? countDown : 'Hết giờ'}</span>
            </div>

            <p className='text-[14px] italic text-slate-500 leading-5'>
              Bạn sẽ nhận được mã trong vòng một phút, xin vui lòng chờ.
            </p>
          </div>
        ) : (
          <Input
            id='email'
            label='Email'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='email'
            icon={MdEmail}
            className='mb-5'
            onFocus={() => clearErrors('email')}
          />
        )}

        <div className='flex justify-end mb-3 -mt-3'>
          <a href='/auth/login' className='text-dark underline hover:text-sky-600 common-transition'>
            Quay lại đăng nhập
          </a>
        </div>

        {/* MARK: Send Button */}
        <div className='flex items-center justify-end gap-3'>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSent && isCounting}
            className={`group bg-secondary rounded-lg py-2 px-3 text-light flex gap-2 hover:bg-primary hover:text-dark common-transition font-semibold ${
              isLoading || isCounting ? 'bg-slate-200 pointer-events-none' : ''
            }`}>
            {isLoading || isCounting ? (
              <FaCircleNotch
                size={24}
                className='text-light group-hover:text-dark common-transition animate-spin'
              />
            ) : (
              'Gửi mã'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
