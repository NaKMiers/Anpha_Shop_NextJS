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
  FaArrowLeft,
  FaCaretDown,
  FaCheck,
  FaFilter,
  FaPlay,
  FaPlus,
  FaTrash,
} from 'react-icons/fa'
import { FaCircleUser } from 'react-icons/fa6'
import { MdEdit } from 'react-icons/md'
import { RiCharacterRecognitionFill, RiCharacterRecognitionLine } from 'react-icons/ri'

function AddTagPage() {
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
      label: '',
      isFeatured: false,
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
        <div className='py-2 px-3 text-light border border-slate-300 rounded-lg text-2xl'>Add Tag</div>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-yellow-300 hover:text-secondary'
          href='/admin/product/add'>
          <FaArrowLeft />
          Back
        </Link>
      </div>

      <div className='pt-5' />

      <div>
        <Input
          id='label'
          label='Label'
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type='text'
          icon={RiCharacterRecognitionLine}
          className='mb-5'
        />

        <div className='flex'>
          <div className='bg-white rounded-lg px-3 flex items-center'>
            <FaPlay size={16} className='text-secondary' />
          </div>
          <label
            className={`bg-white select-none cursor-pointer border border-green-500 px-4 py-2 rounded-lg text-green-500 ${
              isChecked ? 'bg-green-500 text-white' : ''
            }`}
            htmlFor='isFeatured'
            onClick={() => setIsChecked(!isChecked)}>
            Featured
          </label>
          <input
            type='checkbox'
            id='isFeatured'
            hidden
            {...register('isFeatured', { required: false })}
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

export default AddTagPage
