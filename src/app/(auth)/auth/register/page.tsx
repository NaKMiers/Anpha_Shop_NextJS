'use client'

import Input from '@/components/Input'
import { registerApi } from '@/requests'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaEyeSlash } from 'react-icons/fa'
import { FaCircleNotch, FaCircleUser } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'

function ResgiterPage() {
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
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  })

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // username must be at least 6 characters
      if (data.username.length < 6) {
        setError('username', {
          type: 'manual',
          message: 'Username phải có ít nhất 6 ký tự',
        })
        isValid = false
      }

      // email must be valid
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
        setError('email', {
          type: 'manual',
          message: 'Email không hợp lệ',
        })
        isValid = false
      }

      // password must be at least 6 characters and contain at least 1 lowercase, 1 uppercase, 1 number
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(data.password)) {
        setError('password', {
          type: 'manual',
          message:
            'Mật khẩu phải có ít nhất 6 kí tự và bao gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số',
        })
        isValid = false
      }

      // password and rePassword must be the same
      if (data.password !== data.rePassword) {
        setError('rePassword', {
          type: 'manual',
          message: 'Mật khẩu không trùng khớp',
        })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // MARK: Register Submition
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate form
      if (!handleValidate(data)) return

      // start loading
      setIsLoading(true)

      try {
        // register logic here
        const { user, message } = await registerApi(data)

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
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setIsLoading(false)
      }
    },
    [handleValidate, router]
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
          onFocus={() => clearErrors('username')}
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
          onFocus={() => clearErrors('email')}
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
          onFocus={() => clearErrors('password')}
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
          onFocus={() => clearErrors('rePassword')}
        />

        <div className='flex justify-end mb-3 -mt-3'>
          <a href='/auth/forgot-password' className='text-dark hover:underline'>
            Quên mật khẩu?
          </a>
        </div>

        <div className='flex items-center justify-end gap-3 mb-4'>
          <a href='/auth/login' className='underline text-sky-500'>
            Đăng nhập
          </a>

          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className={`h-[40px] min-w-[48px] flex items-center justify-center group bg-secondary rounded-lg py-2 px-3 text-light hover:bg-primary hover:text-dark common-transition font-semibold ${
              isLoading ? 'bg-slate-200 pointer-events-none' : ''
            }`}>
            {isLoading ? (
              <FaCircleNotch
                size={18}
                className='text-light group-hover:text-dark common-transition animate-spin'
              />
            ) : (
              'Đăng ký'
            )}
          </button>
        </div>

        <hr />

        <p className='text-center text-slate-500 font-body text-lg py-4'>Hoặc đăng nhập với</p>

        {/* MARK: Social Login */}
        <div className='flex items-center justify-center gap-4'>
          {/* <button
            className='p-2 rounded-full border-2 border-slate-800 group hover:bg-slate-300 common-transition'
            onClick={() => signIn('twitter', { callbackUrl: '/' })}>
            <Image className='wiggle' src='/images/twitter.jpg' height={25} width={25} alt='github' />
          </button> */}

          <button
            className='p-2 rounded-full border-2 border-yellow-300 group hover:bg-yellow-100 common-transition'
            onClick={() => signIn('google', { callbackUrl: '/' })}>
            <Image className='wiggle' src='/images/google.jpg' height={25} width={25} alt='google' />
          </button>

          <button
            className='p-2 rounded-full border-2 border-slate-800 group hover:bg-slate-300 common-transition'
            onClick={() => signIn('github', { callbackUrl: '/' })}>
            <Image className='wiggle' src='/images/github.jpg' height={25} width={25} alt='github' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResgiterPage
