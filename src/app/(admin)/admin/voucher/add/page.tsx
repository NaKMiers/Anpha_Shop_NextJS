'use client'

import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import { Menu, MenuItem } from '@mui/material'
import { set } from 'mongoose'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import {
  FaArrowAltCircleLeft,
  FaArrowCircleLeft,
  FaArrowLeft,
  FaCaretDown,
  FaCheck,
  FaFilter,
  FaMinus,
  FaPlus,
  FaQuoteRight,
  FaTrash,
  FaUserEdit,
  FaWindowMaximize,
} from 'react-icons/fa'
import { FaPlay, FaPause } from 'react-icons/fa6'

import { FaCircleUser } from 'react-icons/fa6'
import { MdEdit, MdNumbers } from 'react-icons/md'
import { RiCharacterRecognitionFill, RiCharacterRecognitionLine } from 'react-icons/ri'

function AddVoucherPage() {
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
      code: '',
      description: '',
      begin: '',
      expire: '',
      minTotal: '',
      maxReduce: '',
      type: 'percentage',
      value: '',
      timesLeft: '',
      owner: '',
      isActive: false,
    },
  })

  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null)
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null)
  const [anchorEl3, setAnchorEl3] = useState<null | HTMLElement>(null)
  const [anchorEl4, setAnchorEl4] = useState<null | HTMLElement>(null)
  const open1 = Boolean(anchorEl1)
  const open2 = Boolean(anchorEl2)
  const open3 = Boolean(anchorEl3)
  const open4 = Boolean(anchorEl4)

  // open menu
  const handleOpenMenu1 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl1(event.currentTarget)
  }
  // close menu
  const handleCloseMenu1 = () => {
    setAnchorEl1(null)
  }

  // open menu
  const handleOpenMenu2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget)
  }
  // close menu
  const handleCloseMenu2 = () => {
    setAnchorEl2(null)
  }

  // open menu
  const handleOpenMenu3 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget)
  }
  // close menu
  const handleCloseMenu3 = () => {
    setAnchorEl2(null)
  }

  // open menu
  const handleOpenMenu4 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget)
  }
  // close menu
  const handleCloseMenu4 = () => {
    setAnchorEl2(null)
  }

  const handleFilter = useCallback(() => {}, [])

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
          Add Voucher
        </div>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'
          href='/admin/voucher/all'>
          <FaArrowLeft />
          Back
        </Link>
      </div>

      <div className='pt-5' />

      <div>
        {/* Code */}
        <Input
          id='code'
          label='Code'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='text'
          icon={RiCharacterRecognitionLine}
          className='mb-5'
        />

        {/* Description */}
        <Input
          id='description'
          label='Description'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='textarea'
          icon={FaQuoteRight}
          className='mb-5'
        />

        <div className='mb-5 grid grid-cols-1 lg:grid-cols-2 gap-5'>
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
        </div>

        <div className='mb-5 grid grid-cols-1 lg:grid-cols-2 gap-5'>
          {/* Min Total */}
          <Input
            id='minTotal'
            label='Min Total'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='number'
            icon={FaMinus}
          />

          {/* Expire */}
          <Input
            id='maxReduce'
            label='Max Reduce'
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type='number'
            icon={FaWindowMaximize}
          />
        </div>

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

        {/* Times Left */}
        <Input
          id='timesLeft'
          label='Times Left'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='number'
          icon={FaArrowCircleLeft}
          className='mb-5'
        />

        {/* Owner */}
        <Input
          id='owner'
          label='Owner'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='select'
          options={[
            {
              value: 'asd@asd.asd',
              label: 'Admin',
              selected: false,
            },
            {
              value: 'xxx@xxx.xxx',
              label: 'User',
              selected: false,
            },
          ]}
          icon={FaUserEdit}
          className='mb-5'
        />

        <div className='flex'>
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
          className='mt-4 px-4 py-2 bg-secondary hover:bg-primary text-light rounded-lg font-semibold common-transition'>
          Add
        </button>
      </div>
    </div>
  )
}

export default AddVoucherPage
