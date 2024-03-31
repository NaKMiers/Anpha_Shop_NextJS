'use client'

import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading } from '@/libs/reducers/modalReducer'
import { IUser } from '@/models/UserModel'
import axios from 'axios'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  FaArrowCircleLeft,
  FaArrowLeft,
  FaMinus,
  FaQuoteRight,
  FaUserEdit,
  FaWindowMaximize,
} from 'react-icons/fa'
import { FaPause, FaPlay } from 'react-icons/fa6'

import { MdNumbers } from 'react-icons/md'
import { RiCharacterRecognitionLine, RiCheckboxMultipleBlankLine } from 'react-icons/ri'

function AddVoucherPage() {
  // store
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  const [isChecked, setIsChecked] = useState(true)
  const [roleUsers, setRoleUsers] = useState<IUser[]>([])

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      code: '',
      description: '',
      // default begin is today
      begin: new Date().toISOString().split('T')[0],
      expire: '',
      minTotal: 0,
      maxReduce: '',
      type: 'fixed-reduce',
      value: '',
      timesLeft: 1,
      owner: '',
      isActive: true,
    },
  })

  // get roleUsers, admins, editors
  useEffect(() => {
    const getRoleUsers = async () => {
      try {
        // send request to server to get role-users
        const res = await axios.get('/api/admin/user/role-users')

        // set roleUsers to state
        setRoleUsers(res.data.roleUsers)
        setValue('owner', res.data.roleUsers.find((user: IUser) => user.role === 'admin')._id)
      } catch (err: any) {
        console.log(err)
      }
    }
    getRoleUsers()
  }, [setValue])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true
      // code >= 5
      if (data.code.length < 5) {
        setError('code', {
          type: 'manual',
          message: 'Code must be at least 5 characters',
        })
        isValid = false
      }

      // code < 10
      if (data.code.length > 10) {
        setError('code', {
          type: 'manual',
          message: 'Code must be at most 10 characters',
        })
        isValid = false
      }

      // begin < expire when expire is not empty
      if (data.expire && data.begin > data.expire) {
        setError('expire', {
          type: 'manual',
          message: 'Expire must be greater than begin',
        })
        isValid = false
      }

      // minTotal >= 0
      if (data.minTotal < 0) {
        setError('minTotal', {
          type: 'manual',
          message: 'Min total must be >= 0',
        })
        isValid = false
      }

      // maxReduce >= 0
      if (data.maxReduce < 0) {
        setError('maxReduce', {
          type: 'manual',
          message: 'Max reduce must be >= 0',
        })
        isValid = false
      }

      // timesLeft >= 0
      if (data.timesLeft < 0) {
        setError('timesLeft', {
          type: 'manual',
          message: 'Times left must be >= 0',
        })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // handle send request to server to add voucher
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate form
      if (!handleValidate(data)) return

      dispatch(setLoading(true))

      try {
        // send request to server to add voucher
        const res = await axios.post('/api/admin/voucher/add', data)

        // show success message
        toast.success(res.data.message)

        // reset form
        reset()
      } catch (err: any) {
        console.log(err)
        toast.error(err.response.data.message)
      } finally {
        dispatch(setLoading(false))
      }
    },
    [handleValidate, reset, dispatch]
  )

  // Enter key to submit
  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleSubmit(onSubmit)()
    }

    window.addEventListener('keydown', handleEnter)
    return () => window.removeEventListener('keydown', handleEnter)
  }, [handleSubmit, onSubmit])

  return (
    <div className='max-w-1200 mx-auto'>
      <div className='flex items-end mb-3 gap-3'>
        <Link
          className='flex items-center gap-1 bg-slate-200 py-2 px-3 rounded-lg common-transition hover:bg-white hover:text-primary'
          href='/admin'>
          <FaArrowLeft />
          Admin
        </Link>
        <div className='py-2 px-3 text-light border border-slate-300 rounded-lg text-2xl text-center'>
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
        <div className='b-5 grid grid-cols-1 lg:grid-cols-2 gap-5'>
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
            options={roleUsers.map(user => ({
              value: user._id,
              label: `${user.firstname} ${user.lastname} - (${
                user.role.charAt(0).toUpperCase() + user.role.slice(1)
              })`,
              selected: user.role === 'admin',
            }))}
            icon={FaUserEdit}
            className='mb-5'
          />
        </div>

        {/* Description */}
        <Input
          id='description'
          label='Description'
          disabled={isLoading}
          register={register}
          errors={errors}
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
            type='date'
            icon={FaPlay}
          />

          {/* Expire */}
          <Input
            id='expire'
            label='Expire'
            disabled={isLoading}
            register={register}
            errors={errors}
            type='date'
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

          {/* Max Reduce */}
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

        <div className='mb-5 grid grid-cols-1 lg:grid-cols-2 gap-5'>
          {/* Type */}
          <Input
            id='type'
            label='Type'
            disabled={isLoading}
            register={register}
            errors={errors}
            icon={RiCheckboxMultipleBlankLine}
            type='select'
            options={[
              {
                value: 'fixed-reduce',
                label: 'Fixed Reduce',
                selected: true,
              },
              {
                value: 'percentage',
                label: 'Percentage',
              },
              {
                value: 'fixed',
                label: 'Fixed',
              },
            ]}
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
          />
        </div>

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

        <div className='flex'>
          <div className='bg-white rounded-lg px-3 flex items-center'>
            <FaPlay size={16} className='text-secondary' />
          </div>
          <label
            className={`select-none cursor-pointer border border-green-600 px-4 py-2 rounded-lg common-transition  ${
              isChecked ? 'bg-green-600 text-white' : 'bg-white text-green-600'
            }`}
            htmlFor='isActive'
            onClick={() => setIsChecked(!isChecked)}>
            Active
          </label>
          <input type='checkbox' id='isActive' hidden {...register('isActive', { required: false })} />
        </div>

        <LoadingButton
          className='mt-4 px-4 py-2 bg-secondary hover:bg-primary text-light rounded-lg font-semibold common-transition'
          onClick={handleSubmit(onSubmit)}
          text='Add'
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default AddVoucherPage
