'use client'

import Input from '@/components/Input'
import { formatPrice } from '@/utils/formatNumber'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { FaCamera, FaPlus } from 'react-icons/fa'
import { FaC } from 'react-icons/fa6'
import { HiLightningBolt } from 'react-icons/hi'
import { CiHashtag } from 'react-icons/ci'

function UserPage() {
  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  })
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div>
      <h1 className='font-semibold text-3xl font-body tracking-wide mb-5'>TÀI KHOẢN CỦA TÔI</h1>

      <div className='grid grid-cols-12 gap-21'>
        <div className='col-span-12 sm:col-span-5 lg:col-span-3 sm:border-r border-slate-400 p-2'>
          <div className='relative aspect-square max-w-[200px] mx-auto rounded-full overflow-hidden cursor-pointer p-3 group'>
            <Image className='w-full' src='/images/logo.jpg' width={160} height={160} alt='avatar' />
            <div className='absolute top-0 left-0 flex opacity-0 group-hover:opacity-100 items-center justify-center bg-primary w-full h-full bg-opacity-50 common-transition'>
              <FaCamera size={52} className='text-white' />
            </div>
          </div>

          <div className='sm:hidden border-b border-slate-400 max-w-[200px] mx-auto mt-3 -mb-2' />
        </div>

        <div className='col-span-12 text-center sm:text-start sm:col-span-7 lg:col-span-9 grid grid-cols-12'>
          <div className='col-span-12 md:col-span-7'>
            <div className='mb-3'>
              <p className='font-semibold'>Email</p>
              <p>diwas118151@gmail.com</p>
            </div>

            <div className='mb-3'>
              <p className='font-semibold'>Tổng tích lũy</p>
              <p>{formatPrice(203033222)}</p>
            </div>
          </div>

          <div className='col-span-12 md:col-span-5'>
            <div className='mb-3'>
              <p className='font-semibold'>Số dư tài khoản</p>
              <div className='flex items-center gap-2 justify-center sm:justify-normal'>
                <p className='text-green-500'>{formatPrice(203033222)}</p>
                <Link
                  className='group flex-shrink-0 rounded-full border-2 border-primary hover:border-secondary p-[2px] hover:scale-110 common-transition'
                  href='/user/recharge'>
                  <FaPlus
                    size={10}
                    className='text-primary common-transition group-hover:text-secondary'
                  />
                </Link>
              </div>
            </div>

            <div className='mb-3'>
              <p className='font-semibold mb-1'>Nạp tiền</p>
              <Link
                href='/user/recharge'
                className='bg-primary px-3 py-[6px] rounded-extra-small inline-flex items-center gap-1 group hover:bg-secondary common-transition'>
                <span className='font-bold font-body text-white text-[18px] tracking-[0.02em] group-hover:text-white common-transition'>
                  Nạp
                </span>
                <HiLightningBolt
                  size={20}
                  className='animate-bounce text-white group-hover:text-white common-transition'
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='pt-6' />

      <div>
        <h3 className='text-2xl font-semibold mb-5'>
          Thông tin chi tiết{' '}
          <button
            className='text-sky-600 text-base font-normal group'
            onClick={() => setIsEditing(!isEditing)}>
            (<span className='group-hover:underline'>chỉnh sửa</span>)
          </button>
        </h3>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-21'>
          <div className='col-span-1'>
            {isEditing ? (
              <Input
                className='mt-2'
                id='lastName'
                label='Họ'
                disabled={false}
                register={register}
                errors={errors}
                icon={CiHashtag}
                required
                type='text'
              />
            ) : (
              <>
                <span className='font-semibold'>Họ: </span>
                <span>Pi</span>
              </>
            )}
          </div>
          <div className='col-span-1'>
            {isEditing ? (
              <Input
                className='mt-2'
                id='firstName'
                label='Tên'
                disabled={false}
                register={register}
                errors={errors}
                icon={CiHashtag}
                required
                type='text'
              />
            ) : (
              <>
                <span className='font-semibold'>Tên: </span>
                <span>Pi</span>
              </>
            )}
          </div>
          <div className='col-span-1'>
            {isEditing ? (
              <Input
                className='mt-2'
                id='birthday'
                label='Ngày sinh'
                disabled={false}
                register={register}
                errors={errors}
                icon={CiHashtag}
                required
                type='text'
              />
            ) : (
              <>
                <span className='font-semibold'>Ngày sinh: </span>
                <span>14/09/2004</span>
              </>
            )}
          </div>
          <div className='col-span-1'>
            {isEditing ? (
              <Input
                className='mt-2'
                id='job'
                label='Nghề nghiệp'
                disabled={false}
                register={register}
                errors={errors}
                icon={CiHashtag}
                required
                type='text'
              />
            ) : (
              <>
                <span className='font-semibold'>Nghề nghiệp: </span>
                <span>Human</span>
              </>
            )}
          </div>
          <div className='col-span-1'>
            {isEditing ? (
              <Input
                className='mt-2'
                id='address'
                label='Địa chỉ'
                disabled={false}
                register={register}
                errors={errors}
                icon={CiHashtag}
                required
                type='text'
              />
            ) : (
              <>
                <span className='font-semibold'>Địa chỉ: </span>
                <span>49 Trịnh Đình Trọng, Phú Trung, Tân Phú</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPage
