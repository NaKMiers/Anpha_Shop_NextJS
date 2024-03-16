'use client'

import Input from '@/components/Input'
import Link from 'next/link'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import {
  FaArrowCircleLeft,
  FaArrowLeft,
  FaMinus,
  FaQuoteRight,
  FaUserEdit,
  FaWindowMaximize,
} from 'react-icons/fa'
import { FaPause, FaPlay } from 'react-icons/fa6'
import { IoReload } from 'react-icons/io5'

import { MdNumbers } from 'react-icons/md'
import { RiCharacterRecognitionLine } from 'react-icons/ri'

function AddFlashSalePage() {
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [price, setPrice] = useState(9000)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      type: '',
      value: '',
      begin: '',
      expire: '',
      timeType: '',
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    console.log(data)
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
          Add Flash Sale
        </div>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'
          href='/admin/flash-sale/all'>
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
              label: 'Percentage',
              value: 'percentage',
              selected: true,
            },
            {
              label: 'Fixed-Reduce',
              value: 'fixed-reduce',
              selected: false,
            },
            {
              label: 'Fixed',
              value: 'fixed',
              selected: false,
            },
          ]}
          icon={RiCharacterRecognitionLine}
          className='mb-5'
        />

        {/* Value */}
        <Input
          id='value'
          label='Value'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='text'
          icon={MdNumbers}
          className='mb-5'
        />

        {/* Begin */}
        <Input
          id='begin'
          label='Begin'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='text'
          icon={FaPlay}
          className='mb-5'
        />

        <div className='grid grid-col-1 lg:grid-cols-2 gap-5 mb-5'>
          {/* Time Type */}
          <Input
            id='timeType'
            label='Time Type'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='select'
            options={[
              {
                label: 'Loop',
                value: 'loop',
                selected: true,
              },
              {
                label: 'Once',
                value: 'once',
                selected: false,
              },
            ]}
            icon={RiCharacterRecognitionLine}
          />

          {/* Expire */}
          <Input
            id='expire'
            label='Expire'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='text'
            icon={FaPause}
          />

          {/* Duration */}
          <Input
            id='duration'
            label='Duration'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='number'
            icon={IoReload}
          />
        </div>

        <button
          onClick={handleSubmit(onSubmit)}
          className='px-4 py-2 bg-secondary hover:bg-primary text-light rounded-lg font-semibold common-transition'>
          Add
        </button>
      </div>
    </div>
  )
}

export default AddFlashSalePage
