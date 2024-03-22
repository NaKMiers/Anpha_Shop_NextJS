'use client'

import Input from '@/components/Input'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaEyeSlash } from 'react-icons/fa'
import { FaCircleNotch, FaCircleUser } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'

function ResgiterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FieldValues>({
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    // check if password and rePassword are the same
    if (data.password !== data.rePassword) {
      setError('rePassword', {
        type: 'manual',
        message: 'Mật khẩu không trùng khớp',
      })
      return
    }

    // start loading
    setIsLoading(true)

    try {
      // register logic here
      const res = await axios.post('/api/auth/register', data)
      const { user, message } = res.data
      console.log(res.data)

      // sign in user
      const callback = await signIn('credentials', {
        usernameOrEmail: user.username,
        password: data.password,
        redirect: false,
      })

      if (callback?.error) {
        toast.error(callback.error)
      } else {
        // show success message
        toast.success(message)

        // redirect to home page
        router.push('/')
      }
    } catch (err: any) {
      // show error message
      toast.error(err.response.data.message)
      console.log(err)
    } finally {
      // stop loading
      setIsLoading(false)
    }
  }

  return (
    <div className='relative w-full min-h-screen'>
      <div className='bg-white pb-10 max-w-[500px] w-full py-21 px-8 rounded-medium shadow-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <h1 className='text-secondary text-[40px] font-semibold tracking-wide font-body mb-4'>
          Đăng ký
        </h1>

        <Input
          id='username'
          label='Username'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='text'
          icon={FaCircleUser}
          className='mb-5'
        />

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
        />

        <Input
          id='password'
          label='Mật khẩu'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='password'
          icon={FaEyeSlash}
          className='mb-5'
        />

        <Input
          id='rePassword'
          label='Nhập lại mật khẩu'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='password'
          icon={FaEyeSlash}
          className='mb-5'
        />

        <div className='flex items-center justify-end gap-3'>
          <a href='/auth/login' className='underline text-sky-500'>
            Đăng nhập
          </a>

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
              'Đăng ký'
            )}
          </button>
        </div>

        <div className='pt-4' />

        <hr />

        <div className='pt-4' />

        <p className='text-center text-slate-500 font-body text-lg'>Hoặc đăng nhập với</p>

        <div className='pt-4' />

        <div className='flex items-center justify-center gap-4'>
          <button
            className='p-2 rounded-full border-2 border-yellow-300 group hover:bg-yellow-200 common-transition'
            onClick={() => signIn('google', { callbackUrl: '/' })}>
            <Image
              className='group-hover:scale-110 common-transition'
              src='/images/google.jpg'
              height={25}
              width={25}
              alt='google'
            />
          </button>

          <button className='p-2 rounded-full border-2 border-sky-300 group hover:bg-sky-300 common-transition'>
            <Image
              className='group-hover:scale-110 common-transition'
              src='/images/facebook.jpg'
              height={25}
              width={25}
              alt='facebook'
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResgiterPage
