'use client'

import Input from '@/components/Input'
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { FaCheck, FaEyeSlash } from 'react-icons/fa'

function SecurityPage() {
  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  return (
    <div>
      <h1 className='font-semibold text-3xl font-body tracking-wide mb-5'>MẬT KHẨU VÀ BẢO MẬT</h1>

      <p className='text-red-500 mb-4'>
        Tính năng không khả dụng do tài khoản được xác thực bởi google.
      </p>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-21'>
        <div className='col-span-1 flex flex-col gap-4'>
          <Input
            id='oldPassword'
            label='Mật khẩu cũ'
            disabled={isLoading}
            register={register}
            errors={errors}
            icon={FaEyeSlash}
            required
            type='password'
          />

          <Input
            id='newPassword'
            label='Mật khẩu mới'
            disabled={isLoading}
            register={register}
            errors={errors}
            icon={FaEyeSlash}
            required
            type='password'
          />
          <Input
            id='reNewPassword'
            label='Nhập lại mật khẩu mới'
            disabled={isLoading}
            register={register}
            errors={errors}
            icon={FaEyeSlash}
            required
            type='password'
          />

          <button className='rounded-lg self-end py-2 px-4 font-semibold border border-secondary text-secondary hover:bg-secondary common-transition hover:text-white'>
            Lưu
          </button>
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
