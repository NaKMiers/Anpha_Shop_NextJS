'use client'

import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/loadingReducer'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCheck, FaEyeSlash } from 'react-icons/fa'

function SecurityPage() {
  // hook
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.loading.isLoading)
  const { data: session } = useSession()
  const curUser: any = session?.user
  const isLocalAuth = curUser?.authType === 'local'

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      reNewPassword: '',
    },
  })

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // newPassword must be at least 5 characters and contain at least 1 lowercase, 1 uppercase, 1 number, and must not be the same as oldPassword
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(data.newPassword) ||
        data.newPassword === data.oldPassword
      ) {
        setError('newPassword', {
          type: 'manual',
          message: 'Mật khẩu không hợp lệ',
        })
        isValid = false
      }

      // password and rePassword must be the same
      if (data.password !== data.rePassword) {
        setError('reNewPassword', {
          type: 'manual',
          message: 'Mật khẩu không trùng khớp',
        })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    // validate form
    if (!handleValidate(data)) return

    // check if password and rePassword are the same
    if (data.newPassword !== data.reNewPassword) {
      setError('reNewPassword', {
        type: 'manual',
        message: 'Mật khẩu mới không trùng khớp',
      })
      return
    }

    console.log(data)

    // start loading
    dispatch(setLoading(true))
    try {
      // send request to server to change password
      const res = await axios.patch('/api/user/change-password', data)
      console.log('res', res.data)
      // reset form
      reset()
      // show success message
      toast.success(res.data.message)
    } catch (err: any) {
      toast.error(err.response.data.message)
      console.log(err)
    } finally {
      // reset loading state
      dispatch(setLoading(false))
    }
  }

  return (
    <div>
      <h1 className='font-semibold text-3xl font-body tracking-wide mb-5'>MẬT KHẨU VÀ BẢO MẬT</h1>

      {!isLocalAuth && (
        <p className='text-red-500 mb-4'>
          Tính năng không khả dụng do tài khoản được xác thực bởi {curUser?.authType}.
        </p>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-21 pb-5'>
        <div className='col-span-1 flex flex-col gap-4'>
          <Input
            id='oldPassword'
            label='Mật khẩu cũ'
            disabled={!isLocalAuth || isLoading}
            register={register}
            errors={errors}
            icon={FaEyeSlash}
            required
            type='password'
          />

          <Input
            id='newPassword'
            label='Mật khẩu mới'
            disabled={!isLocalAuth || isLoading}
            register={register}
            errors={errors}
            icon={FaEyeSlash}
            required
            type='password'
          />
          <Input
            id='reNewPassword'
            label='Nhập lại mật khẩu mới'
            disabled={!isLocalAuth || isLoading}
            register={register}
            errors={errors}
            icon={FaEyeSlash}
            required
            type='password'
          />

          {isLocalAuth && (
            <LoadingButton
              className='px-4 py-2 bg-secondary hover:bg-primary text-light rounded-lg font-semibold common-transition'
              onClick={handleSubmit(onSubmit)}
              text='Lưu'
              isLoading={isLoading}
            />
          )}
        </div>

        <div className='col-span-1'>
          <h4 className='text-2xl mb-2'>Mật khẩu</h4>
          <ul>
            <li className='flex items-center gap-2'>
              <FaCheck size={16} className='text-green-500' />
              <p>Phải có tối thiếu 6 ký tự</p>
            </li>
            <li className='flex items-center gap-2'>
              <FaCheck size={16} className='text-green-500' />
              <p>Phải có ít nhất một chữ hoa</p>
            </li>
            <li className='flex items-center gap-2'>
              <FaCheck size={16} className='text-green-500' />
              <p>Phải có ít nhất một chữ thường</p>
            </li>
            <li className='flex items-center gap-2'>
              <FaCheck size={16} className='text-green-500' />
              <p>Phải có ít nhất một chữ số</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SecurityPage
