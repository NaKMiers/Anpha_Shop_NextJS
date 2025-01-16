'use client'

import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAppDispatch, useAppSelector } from '@/libs/hooks'
import { setLoading, setPageLoading } from '@/libs/reducers/modalReducer'
import { IUser } from '@/models/UserModel'
import { editUserApi, getUserApi } from '@/requests'
import { toUTC } from '@/utils/time'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCalendarAlt, FaDollarSign, FaPhone, FaUser } from 'react-icons/fa'
import { GoSingleSelect } from 'react-icons/go'
import { IoText } from 'react-icons/io5'
import { MdEmail } from 'react-icons/md'

function EditUserPage({ params: { id } }: { params: { id: string } }) {
  // hooks
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(state => state.modal.isLoading)
  const router = useRouter()

  // states
  const [user, setUser] = useState<IUser | null>(null)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues: {
      username: user?.username,
      email: user?.email,
      phone: user?.phone,
      authType: user?.authType,
      firstname: user?.firstname,
      lastname: user?.lastname,
      birthday: user?.birthday,
      address: user?.address,
      job: user?.job,
      balance: user?.balance,
      accumulated: user?.accumulated,
      totalIncome: user?.totalIncome,
      commission: user?.commission,
    },
  })

  // MARK: Get Data
  // get user to edit
  useEffect(() => {
    const getUser = async () => {
      // star page loading
      dispatch(setPageLoading(true))

      try {
        const { user } = await getUserApi(id) // no-cache

        // set user to state
        setUser(user)

        // set value to form
        setValue('username', user.username)
        setValue('email', user.email)
        setValue('phone', user.phone)
        setValue('authType', user.authType)
        setValue('firstname', user.firstname)
        setValue('lastname', user.lastname)
        setValue('birthday', moment(user.birthday).format('YYYY-MM-DD'))
        setValue('address', user.address)
        setValue('job', user.job)
        setValue('balance', user.balance)
        setValue('accumulated', user.accumulated)
        setValue('totalIncome', user.totalIncome)
        setValue('commission', user.commission)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }

    getUser()
  }, [dispatch, id, setValue])

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // check if user is not found
      if (!user) {
        toast.error('User not found')
        return false
      }

      // only update if there is any change
      let countChanges: number = 0

      if (data.username !== user.username) countChanges++
      if (data.email !== user.email) countChanges++
      if (data.phone !== user.phone) countChanges++
      if (data.authType !== user.authType) countChanges++
      if (data.firstname !== user.firstname) countChanges++
      if (data.lastname !== user.lastname) countChanges++
      if (data.birthday !== moment(user.birthday).format('YYYY-MM-DD')) countChanges++
      if (data.address !== user.address) countChanges++
      if (data.job !== user.job) countChanges++
      if (data.balance !== user.balance) countChanges++
      if (data.accumulated !== user.accumulated) countChanges++
      if (data.totalIncome !== user.totalIncome) countChanges++
      if (data.commission.type !== user.commission?.type) countChanges++
      if (data.commission.value !== user.commission?.value) countChanges++

      if (countChanges === 0) {
        toast.error('No changes to update')
        return false
      }

      return isValid
    },
    [user]
  )

  // MARK: Submit
  // send request to server to edit account
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    // validate form
    if (!handleValidate(data)) return

    // start loading
    dispatch(setLoading(true))

    try {
      const { message } = await editUserApi(id, {
        ...data,
        birthday: data.birthday ? toUTC(data.birthday) : null,
      })

      // show success message
      toast.success(message)

      // reset form
      reset()
      dispatch(setPageLoading(false))

      // redirect back
      router.back()
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="mx-auto max-w-1200">
      {/* MARK: Admin Header */}
      <AdminHeader
        title="Edit User"
        backLink="/admin/user/all"
      />

      <div className="mt-5">
        <div className="flex flex-col items-start gap-21 md:flex-row">
          <div className="relative flex-shrink-0">
            <div className="aspect-square w-full max-w-[100px] overflow-hidden rounded-lg shadow-lg">
              <Image
                src={user?.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR!}
                height={200}
                width={200}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            </div>

            {user?.role && (
              <div className="absolute -top-2 left-1/2 z-30 -translate-x-1/2 rounded-md bg-secondary px-1.5 py-[2px] font-body text-xs text-yellow-300 shadow-md">
                {user.role}
              </div>
            )}
          </div>

          <div className="flex w-full flex-col gap-2">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              <Input
                id="firstname"
                label="First Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type="text"
                icon={IoText}
                onFocus={() => clearErrors('firstname')}
              />
              <Input
                id="lastname"
                label="Last Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type="text"
                icon={IoText}
                onFocus={() => clearErrors('lastname')}
              />
              <Input
                id="authType"
                label="Auth Type"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type="select"
                options={[
                  { value: 'local', label: 'Local' },
                  { value: 'google', label: 'Google' },
                  { value: 'github', label: 'Github' },
                ]}
                icon={GoSingleSelect}
                onFocus={() => clearErrors('authType')}
              />
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <Input
                id="username"
                label="Username"
                disabled={isLoading}
                register={register}
                errors={errors}
                required={!!user?.username}
                type="text"
                icon={FaUser}
                onFocus={() => clearErrors('username')}
              />
              <Input
                id="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type="email"
                icon={MdEmail}
                onFocus={() => clearErrors('email')}
              />
              <Input
                id="phone"
                label="Phone"
                disabled={isLoading}
                register={register}
                errors={errors}
                required={!!user?.phone}
                type="text"
                icon={FaPhone}
                onFocus={() => clearErrors('phone')}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 grid w-full grid-cols-1 gap-2 md:grid-cols-3">
          <Input
            id="balance"
            label="Balance"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="number"
            icon={FaDollarSign}
            onFocus={() => clearErrors('balance')}
          />

          <Input
            id="accumulated"
            label="Accumulated"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="number"
            icon={FaDollarSign}
            onFocus={() => clearErrors('accumulated')}
          />
          <Input
            id="totalIncome"
            label="Total Income"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            type="number"
            icon={FaDollarSign}
            onFocus={() => clearErrors('totalIncome')}
          />
        </div>

        <div className="mt-5 grid w-full grid-cols-2 gap-2">
          <Input
            id="commission.type"
            label="Commission"
            disabled={isLoading}
            register={register}
            errors={errors}
            required={!!user?.commission}
            type="select"
            options={[
              { value: 'percentage', label: 'Percentage' },
              { value: 'fixed', label: 'Fixed' },
            ]}
            icon={GoSingleSelect}
            onFocus={() => clearErrors('commission.type')}
          />
          <Input
            id="commission.value"
            label="Commission"
            disabled={isLoading}
            register={register}
            errors={errors}
            required={!!user?.commission}
            type="text"
            icon={FaDollarSign}
            onFocus={() => clearErrors('commission.value')}
          />
        </div>

        <div className="mt-5 grid w-full grid-cols-1 gap-2 md:grid-cols-3">
          <Input
            id="birthday"
            label="Birthday"
            disabled={isLoading}
            register={register}
            errors={errors}
            type="date"
            min={moment('01/01/1910').format('YYYY-MM-DD')}
            max={moment().format('YYYY-MM-DD')}
            icon={FaCalendarAlt}
            onFocus={() => clearErrors('birthday')}
          />
          <Input
            id="job"
            label="Job"
            disabled={isLoading}
            register={register}
            errors={errors}
            type="text"
            icon={IoText}
            onFocus={() => clearErrors('job')}
          />
          <Input
            id="address"
            label="Address"
            disabled={isLoading}
            register={register}
            errors={errors}
            type="text"
            icon={IoText}
            onFocus={() => clearErrors('address')}
          />
        </div>

        {/* Save Button */}
        <LoadingButton
          className="trans-200 mt-6 rounded-lg bg-secondary px-4 py-2 font-semibold text-white hover:bg-primary"
          onClick={handleSubmit(onSubmit)}
          text="Save"
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default EditUserPage
