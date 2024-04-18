'use client'

import Input from '@/components/Input'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaEyeSlash } from 'react-icons/fa'
import { FaCircleNotch, FaCircleUser } from 'react-icons/fa6'

function LoginPage() {
  // hooks
  const router = useRouter()

  // states
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // form
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

  // MARK: Login Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      setIsLoading(true)

      try {
        // send request to server
        const res = await signIn('credentials', { ...data, redirect: false })

        if (res?.ok) {
          // show success message
          toast.success('Đăng nhập thành công')

          // redirect to home page
          router.push('/')
        }

        if (res?.error) {
          // show error message
          toast.error(res.error)
          setError('usernameOrEmail', { type: 'manual' })
          setError('password', { type: 'manual' })
        }
      } catch (err: any) {
        toast.error(err.message)
        console.log(err)
      } finally {
        // reset loading state
        setIsLoading(false)
      }
    },
    [setError, router]
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

        <div className='flex justify-end mb-3 -mt-3'>
          <a href='/auth/forgot-password' className='text-dark hover:underline'>
            Quên mật khẩu?
          </a>
        </div>

        <div className='flex items-center justify-end gap-3 mb-4'>
          <a href='/auth/register' className='underline text-sky-500'>
            Đăng ký
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
              'Đăng nhập'
            )}
          </button>
        </div>

        <hr />

        {/* MARK: Social Login */}
        <p className='text-center text-slate-500 font-body text-lg py-4'>Hoặc đăng nhập với</p>

        <div className='flex items-center justify-center gap-4'>
          <button
            className='p-2 rounded-full border-2 border-yellow-300 group hover:bg-yellow-200 common-transition'
            onClick={() => signIn('google', { callbackUrl: '/' })}>
            <Image className='wiggle' src='/images/google.jpg' height={25} width={25} alt='google' />
          </button>

          {/* <button
            className='p-2 rounded-full border-2 border-sky-300 group hover:bg-sky-300 common-transition'
            onClick={() => signIn('facebook')}>
            <Image className='wiggle' src='/images/facebook.jpg' height={25} width={25} alt='facebook' />
          </button> */}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
