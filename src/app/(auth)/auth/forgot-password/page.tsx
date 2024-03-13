'use client'

import Input from '@/components/Input'
import { useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'

function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false)
  const [isCounting, setIsCounting] = useState(false)
  const [countDown, setCountDown] = useState(60)

  useEffect(() => {
    if (isSent) {
      setIsCounting(true)
      const interval = setInterval(() => {
        if (countDown === 0) {
          clearInterval(interval)
          setIsCounting(false)
          return
        }
        setCountDown(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isSent, countDown])

  console.log(isCounting)

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    setIsSent(true)
    setIsCounting(true)
    setCountDown(60)

    try {
      toast.success('Sent')
    } catch (err: any) {
      toast.error(err.response.data.message)
      console.log(err.response.data)
    }
  }

  return (
    <div className='relative w-full min-h-screen'>
      <div className='bg-white pb-10 max-w-[500px] w-full py-21 px-8 rounded-medium shadow-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <h1 className='text-secondary text-[40px] font-semibold tracking-wide font-body mb-4'>
          Quên Mật Khẩu
        </h1>

        {isSent ? (
          <div className='flex items-center justify-between gap-3 mb-3'>
            <div className='flex items-center gap-2 border border-slate-300 py-2 px-3 rounded-lg'>
              {countDown ? <FaCircleNotch size={20} className='text-slate-300 animate-spin' /> : ''}
              <span className='text-slate-400 text-nowrap'>{countDown > 0 ? countDown : 'Hết giờ'}</span>
            </div>

            <p className='text-[14px] italic text-slate-500 leading-5'>
              Mã xác nhận sẽ gửi đến bạn trong một phút, xin vui lòng chờ.
            </p>
          </div>
        ) : (
          <Input
            id='email'
            label='Email'
            disabled={isSent}
            register={register}
            errors={errors}
            required
            type='email'
            icon={MdEmail}
            className='mb-5'
          />
        )}

        <div className='flex justify-end mb-3 -mt-3'>
          <a href='/auth/login' className='text-dark'>
            Quay lại đăng nhập
          </a>
        </div>

        <div className='flex items-center justify-end gap-3'>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSent && isCounting}
            className={`group bg-secondary rounded-lg py-2 px-3 text-light flex gap-2 hover:bg-primary hover:text-dark common-transition font-semibold ${
              isSent && isCounting ? 'bg-slate-200 pointer-events-none' : ''
            }`}>
            {isSent && isCounting ? (
              <FaCircleNotch
                size={24}
                className='text-light group-hover:text-dark common-transition animate-spin'
              />
            ) : isSent ? (
              'Gửi lại mã'
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
