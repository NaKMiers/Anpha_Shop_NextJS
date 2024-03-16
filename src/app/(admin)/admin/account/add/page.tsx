'use client'

import Input from '@/components/Input'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/loadingReducer'
import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaInfo } from 'react-icons/fa'
import { FaPlay } from 'react-icons/fa6'
import { ImClock } from 'react-icons/im'

import { MdAutorenew } from 'react-icons/md'
import { RiCharacterRecognitionLine } from 'react-icons/ri'

function AddAccountPage() {
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.loading.isLoading)
  const [isChecked, setIsChecked] = useState(false)

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      type: '',
      information: '',
      renew: '',
      days: '',
      hours: 0,
      minutes: 0,
      seconds: 0,
      active: false,
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    dispatch(setLoading(true))

    console.log(data)
    // try {
    //   // add new tag login here
    //   const res = await axios.post('/api/admin/tag/add', data)
    //   console.log(res.data)
    // } catch (err: any) {
    // console.log(err)
    //   toast.error(err.message)
    // }
  }

  return (
    <div className='max-w-1200 mx-auto'>
      <div className='flex items-end mb-3 gap-3'>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-white hover:text-primary'
          href='/admin'>
          <FaArrowLeft />
          Admin
        </Link>
        <div className='py-2 px-3 text-light border border-slate-300 rounded-lg text-2xl'>
          Add Account
        </div>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'
          href='/admin/account/all'>
          <FaArrowLeft />
          Back
        </Link>
      </div>

      <div className='pt-5' />

      <div>
        {/* Type */}
        <Input
          id='type'
          label='Type'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='select'
          options={[
            {
              label: '1',
              value: '1',
              selected: true,
            },
            {
              label: '2',
              value: '2',
              selected: false,
            },
            {
              label: '3',
              value: '3',
              selected: false,
            },
          ]}
          icon={RiCharacterRecognitionLine}
          className='mb-5'
        />

        {/* Information */}
        <Input
          id='information'
          label='Information'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='textarea'
          rows={8}
          icon={FaInfo}
          className='mb-5'
        />

        {/* Review Time */}
        <Input
          id='begin'
          label='Begin'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='text'
          icon={MdAutorenew}
          className='mb-5'
        />

        <div className='grid grid-cols-2 md:grid-cols-4 mb-5 gap-1 md:gap-0'>
          {/* Days */}
          <Input
            id='days'
            label='Days'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='number'
            icon={ImClock}
          />
          {/* Hours */}
          <Input
            id='hours'
            label='Hours'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='number'
          />
          {/* Minutes */}
          <Input
            id='minutes'
            label='Minutes'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='number'
          />
          {/* Seconds */}
          <Input
            id='seconds'
            label='Seconds'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='number'
          />
        </div>

        {/* Active */}
        <div className='flex mb-5'>
          <div className='bg-white rounded-lg px-3 flex items-center'>
            <FaPlay size={16} className='text-secondary' />
          </div>
          <label
            className={`select-none cursor-pointer border border-green-500 px-4 py-2 rounded-lg common-transition  ${
              isChecked ? 'bg-green-500 text-white' : 'bg-white text-green-500'
            }`}
            htmlFor='isActive'
            onClick={() => setIsChecked(!isChecked)}>
            Active
          </label>
          <input type='checkbox' id='isActive' hidden {...register('isActive', { required: false })} />
        </div>

        <button
          onClick={handleSubmit(onSubmit)}
          className='px-4 py-2 bg-secondary hover:bg-primary text-light rounded-lg font-semibold common-transition'></button>
      </div>
    </div>
  )
}

export default AddAccountPage
