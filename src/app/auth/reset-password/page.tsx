'use client'

import Input from '@/components/Input'
import Image from 'next/image'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaEyeSlash } from 'react-icons/fa'
import { FaCircleNotch, FaCircleUser } from 'react-icons/fa6'
import axios from 'axios'

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    setIsLoading(true)
    try {
    } catch (err: any) {
      toast.error(err.response.data.message)
      console.log(err.response.data)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='relative w-full min-h-screen'>
      <div className='bg-white pb-10 max-w-[500px] w-full py-21 px-8 rounded-medium shadow-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <h1 className='text-secondary text-[40px] font-semibold tracking-wide font-body mb-4'>
          Đặt lại mật khẩu
        </h1>

        <Input
          id='oldPassword'
          label='Mật khẩu cũ'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='password'
          icon={FaEyeSlash}
          className='mb-5'
        />

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
        />

        <div className='flex justify-end mb-3 -mt-3'>
          <a href='/auth/login' className='text-dark'>
            Quay lại đăng nhập
          </a>
        </div>

        <div className='flex items-center justify-end gap-3'>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className={`group bg-secondary rounded-lg py-2 px-3 text-light hover:bg-primary hover:text-dark common-transition font-semibold ${
              isLoading ? 'bg-slate-200 pointer-events-none' : ''
            }`}>
            {isLoading ? (
              <FaCircleNotch
                size={24}
                className='text-light group-hover:text-dark common-transition animate-spin'
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

export default LoginPage
