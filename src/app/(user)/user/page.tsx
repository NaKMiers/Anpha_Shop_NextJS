'use client'

import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/modalReducer'
import { updateProfileApi } from '@/requests'
import { formatPrice } from '@/utils/formatNumber'
import { formatDate } from '@/utils/formatTime'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { CiHashtag } from 'react-icons/ci'
import { FaCamera, FaPlus } from 'react-icons/fa'
import { HiLightningBolt } from 'react-icons/hi'

function UserPage() {
  // hook
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  const { data: session } = useSession()

  // states
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      firstname: '',
      lastname: '',
      birthday: '',
      job: '',
      address: '',
    },
  })

  // get user from session
  useEffect(() => {
    // get user from session
    const curUser: any = session?.user
    setUser(curUser)

    // set form values
    setValue('firstname', curUser?.firstname)
    setValue('lastname', curUser?.lastname)
    setValue('birthday', curUser?.birthday)
    setValue('job', curUser?.job)
    setValue('address', curUser?.address)
  }, [session?.user, setValue])

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    console.log(data)
    dispatch(setLoading(true))

    try {
      // send request to server to update profile
      const { updatedUser, message } = await updateProfileApi(data)
      setUser(updatedUser)

      // turn off editing mode
      setIsEditing(false)

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // reset loading state
      dispatch(setLoading(false))
    }
  }

  return (
    <div>
      <h1 className='font-semibold text-3xl font-body tracking-wide mb-5'>TÀI KHOẢN CỦA TÔI</h1>

      <div className='grid grid-cols-12 gap-21'>
        <div className='col-span-12 sm:col-span-5 lg:col-span-3 sm:border-r border-slate-400 p-2'>
          <div className='relative aspect-square max-w-[200px] mx-auto rounded-full overflow-hidden cursor-pointer p-3 group'>
            <Image
              className='rounded-full common-transition'
              src={user?.avatar || '/images/default-avatar.jpg'}
              width={160}
              height={160}
              alt='avatar'
            />
            <div className='absolute top-0 left-0 flex opacity-0 group-hover:opacity-100 items-center justify-center bg-primary w-full h-full bg-opacity-50 common-transition'>
              <FaCamera size={52} className='text-white' />
            </div>
          </div>

          <div className='sm:hidden border-b border-slate-400 max-w-[200px] mx-auto mt-3 -mb-2' />
        </div>

        <div className='col-span-12 text-center sm:text-start sm:col-span-7 lg:col-span-9 grid grid-cols-12'>
          <div className='col-span-12 md:col-span-7'>
            {user?.username && (
              <div className='mb-3'>
                <p className='font-semibold'>Username</p>
                <p>{user?.username}</p>
              </div>
            )}

            <div className='mb-3'>
              <p className='font-semibold'>Email</p>
              <p>{user?.email}</p>
            </div>

            <div className='mb-3'>
              <p className='font-semibold'>Tổng tích lũy</p>
              {user?.accumulated >= 0 && <p>{formatPrice(user?.accumulated)}</p>}
            </div>
          </div>

          <div className='col-span-12 md:col-span-5'>
            <div className='mb-3'>
              <p className='font-semibold'>Số dư tài khoản</p>
              <div className='flex items-center gap-2 justify-center sm:justify-normal'>
                {user?.balance >= 0 && <p className='text-green-600'>{formatPrice(user?.balance)}</p>}
                <Link
                  className='group flex-shrink-0 rounded-full border-2 border-primary hover:border-secondary p-[2px] hover:scale-110 common-transition'
                  href='/recharge'>
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
                href='/recharge'
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
            className={`text-sky-600 text-base font-normal group ${isEditing ? 'text-yellow-400' : ''}`}
            onClick={() => setIsEditing(!isEditing)}>
            (<span className='group-hover:underline'>{!isEditing ? 'chỉnh sửa' : 'hủy'}</span>)
          </button>
        </h3>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-21'>
          <div className='col-span-1'>
            {isEditing ? (
              <Input
                className='mt-2'
                id='lastname'
                label='Họ'
                disabled={false}
                register={register}
                errors={errors}
                icon={CiHashtag}
                type='text'
              />
            ) : (
              <>
                <span className='font-semibold'>Họ: </span>
                <span>{user?.lastname}</span>
              </>
            )}
          </div>
          <div className='col-span-1'>
            {isEditing ? (
              <Input
                className='mt-2'
                id='firstname'
                label='Tên'
                disabled={false}
                register={register}
                errors={errors}
                icon={CiHashtag}
                type='text'
              />
            ) : (
              <>
                <span className='font-semibold'>Tên: </span>
                <span>{user?.firstname}</span>
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
                type='date'
              />
            ) : (
              <>
                <span className='font-semibold'>Ngày sinh: </span>
                <span>{formatDate(user?.birthday)}</span>
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
                type='text'
              />
            ) : (
              <>
                <span className='font-semibold'>Nghề nghiệp: </span>
                <span>{user?.job}</span>
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
                type='text'
              />
            ) : (
              <>
                <span className='font-semibold'>Địa chỉ: </span>
                <span>{user?.address}</span>
              </>
            )}
          </div>
        </div>

        {isEditing && (
          <LoadingButton
            className='mt-5 mb-5 px-4 py-2 bg-secondary hover:bg-primary text-light rounded-lg font-semibold common-transition'
            onClick={handleSubmit(onSubmit)}
            text='Lưu'
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}

export default UserPage
