'use client'

import Input from '@/components/Input'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { FaArrowLeft, FaMoneyBillAlt } from 'react-icons/fa'
import { FaPlay } from 'react-icons/fa6'

import { MdNumbers } from 'react-icons/md'
import { RiCharacterRecognitionLine } from 'react-icons/ri'

function AddVoucherPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      title: '',
      price: '',
      oldPrice: '',
      description: '',
      isActive: false,
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
          Add Product
        </div>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'
          href='/admin/product/all'>
          <FaArrowLeft />
          Back
        </Link>
      </div>

      <div className='pt-5' />

      <div>
        {/* Title */}
        <Input
          id='title'
          label='Title'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='text'
          icon={RiCharacterRecognitionLine}
          className='mb-5'
        />

        <div className='mb-5 grid grid-cols-1 lg:grid-cols-2 gap-5'>
          {/* Price */}
          <Input
            id='price'
            label='Price'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='number'
            icon={FaMoneyBillAlt}
          />

          {/* Old Price */}
          <Input
            id='oldPrice'
            label='Old Price'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='number'
            icon={FaMoneyBillAlt}
          />
        </div>

        {/* Description */}
        <Input
          id='description'
          label='Description'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='textarea'
          rows={10}
          icon={MdNumbers}
          className='mb-5'
        />

        <div className='flex mb-4'>
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

        {/* Tags */}
        <div className='mb-4'>
          <p className='text-light font-semibold text-xl mb-1'>Select Tags</p>

          <div className='p-2 rounded-lg flex flex-wrap items-center bg-white gap-2'>
            {Array.from({ length: 10 }).map((_, index) => (
              <>
                <input
                  onChange={e =>
                    setSelectedTags(prev =>
                      e.target.checked
                        ? [...prev, `tag-${index}`]
                        : prev.filter(tag => tag !== `tag-${index}`)
                    )
                  }
                  hidden
                  type='checkbox'
                  id={`tag-${index}`}
                />
                <label
                  key={index}
                  className={`cursor-pointer select-none rounded-lg border border-green-500 py-[6px] px-3 ${
                    selectedTags.some(tag => tag === `tag-${index}`) ? 'bg-green-500 text-white' : ''
                  }`}
                  htmlFor={`tag-${index}`}>
                  Tag {index}
                </label>
              </>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className='mb-4'>
          <p className='text-light font-semibold text-xl mb-1'>Select Categories</p>

          <div className='p-2 rounded-lg flex flex-wrap items-center bg-white gap-2'>
            {Array.from({ length: 10 }).map((_, index) => (
              <>
                <input
                  onChange={() => setSelectedCategory('cat-' + index)}
                  hidden
                  type='checkbox'
                  id={`cat-${index}`}
                />
                <label
                  key={index}
                  className={`cursor-pointer select-none rounded-lg border border-sky-500 py-[6px] px-3 ${
                    selectedCategory === `cat-${index}` ? 'bg-sky-500 text-white' : ''
                  }`}
                  htmlFor={`cat-${index}`}>
                  Cat {index}
                </label>
              </>
            ))}
          </div>
        </div>

        {/* Images */}
        <Input
          id='images'
          label='Images'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='file'
          rows={10}
          icon={MdNumbers}
          className='mb-5'
        />

        <div className='flex flex-wrap gap-3 rounded-lg bg-white p-3'>
          <Image
            className='rounded-lg'
            src='/images/momo-qr.jpg'
            height={250}
            width={250}
            alt='thumbnail'
          />
          <Image
            className='rounded-lg'
            src='/images/banking-qr.jpg'
            height={250}
            width={250}
            alt='thumbnail'
          />
        </div>

        <button
          onClick={handleSubmit(onSubmit)}
          className='mt-4 px-4 py-2 bg-secondary hover:bg-primary text-light rounded-lg font-semibold common-transition'>
          Add
        </button>
      </div>
    </div>
  )
}

export default AddVoucherPage
