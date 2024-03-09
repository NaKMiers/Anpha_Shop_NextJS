'use client'

import Input from '@/components/Input'
import { useState } from 'react'
import { FieldValues, useForm, SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaEyeSlash } from 'react-icons/fa'
import { FaCircleUser } from 'react-icons/fa6'

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
      // login logic here
    } catch (err: any) {
      toast.error(err.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='relative w-full min-h-screen'>
      <div className='bg-white max-w-[500px] w-full py-21 px-8 rounded-medium shadow-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <h1 className='text-secondary text-[40px] font-semibold tracking-wide font-body mb-2'>
          Đăng nhập
        </h1>

        <Input
          id='usernameOrEmail'
          label='Username / Email'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='text'
          icon={FaCircleUser}
          className='mb-4'
        />

        <Input
          id='password'
          label='Password'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='text'
          icon={FaEyeSlash}
          className='mb-4'
        />
      </div>
    </div>
  )
}

export default LoginPage
