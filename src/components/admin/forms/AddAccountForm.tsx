'use client'

import Input from '@/components/Input'
import LoadingButton from '@/components/LoadingButton'
import { useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { FaCheck, FaInfo } from 'react-icons/fa'
import { FaPlay } from 'react-icons/fa6'
import { ImClock } from 'react-icons/im'

import { GroupTypes } from '@/app/(admin)/admin/account/add/page'
import { addAccountApi } from '@/requests'
import toast from 'react-hot-toast'
import { MdCategory } from 'react-icons/md'

interface AddAccountFormProps {
  groupTypes: GroupTypes
  form: any
  forms: any[]
  handleDuplicateForm: (form: any) => void
  handleRemoveForm: (id: number) => void
  defaultValues: any
  index: number
  className?: string
}

function AddAccountForm({
  groupTypes,
  form,
  forms,
  handleDuplicateForm,
  handleRemoveForm,
  defaultValues,
  index,
  className = '',
}: AddAccountFormProps) {
  // states
  const [loading, setLoading] = useState<boolean>(false)

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    clearErrors,
    reset,
  } = useForm<FieldValues>({
    defaultValues: form,
  })

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // day must be >= 0
      if (data.days < 0) {
        setError('days', { type: 'manual', message: 'Days must be >= 0' })
        isValid = false
      }

      // hours must be >= 0 and <= 23
      if (data.hours < 0 || data.hours > 23) {
        setError('hours', { type: 'manual', message: 'Hours must be from 0 - 23' })
        isValid = false
      }

      // minutes must be >= 0 and <= 59
      if (data.minutes < 0 || data.minutes > 59) {
        setError('minutes', { type: 'manual', message: 'Minutes must be from 0 - 59' })
        isValid = false
      }

      // seconds must be >= 0 and <= 59
      if (data.seconds < 0 || data.seconds > 59) {
        setError('seconds', { type: 'manual', message: 'Seconds must be from 0 - 59' })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  const handleGenerate = useCallback(() => {
    // Hàm trích xuất thông tin từ chuỗi
    const extractInformation = (inputString: string) => {
      let infoPart = inputString
      let additionalInfoPart = ''

      // Kiểm tra nếu có dấu '==='
      const splitIndex = inputString.indexOf('===')
      if (splitIndex !== -1) {
        infoPart = inputString.slice(0, splitIndex)
        additionalInfoPart = inputString.slice(splitIndex + 3).trim()
      }

      const regexEmail = /(\S+@\S+\.\S+)/
      const regexPassword = /(?:🔐 pass:|password:|pass:|pw:|🔐)\s*(\S+)/i
      const regexSlots = /\((\d+)\)\s*(.+?)\s*-\s*(\d+)/g

      const emailMatch = infoPart.match(regexEmail)
      const passwordMatch = infoPart.match(regexPassword)
      const slotsMatches = Array.from(infoPart.matchAll(regexSlots))

      const email = emailMatch ? emailMatch[1] : ''
      const password = passwordMatch ? passwordMatch[1] : ''
      const slots = slotsMatches.map(match => ({
        slot: match[2],
        pin: match[3],
      }))

      // Trích xuất các phần thông tin bổ sung
      const additionalInfo = additionalInfoPart.trim()

      return { email, password, slots, additionalInfo }
    }

    // Hàm tạo kết quả từ thông tin trích xuất
    const generateResults = (data: any) => {
      return data.slots.map((slot: any) => {
        return `✅ Email: ${data.email}
✅ Password: ${data.password}
✅ Slot: ${slot.slot}
✅ Pin: ${slot.pin}

${data.additionalInfo}`
      })
    }

    // Trích xuất thông tin từ chuỗi
    const extractedInfo = extractInformation(getValues('info'))

    // Tạo các kết quả từ thông tin trích xuất
    const results = generateResults(extractedInfo)

    // remove current form
    if (!!results.length) {
      handleRemoveForm(form.id)
    }

    // handleRemoveForm(form.id)
    results.forEach((result: string[]) =>
      handleDuplicateForm({
        ...getValues(),
        info: result,
      })
    )
  }, [getValues, handleDuplicateForm, handleRemoveForm, form.id])

  // MARK: Submit
  // send request to server to add account
  const onSubmit: SubmitHandler<FieldValues> = async data => {
    if (!handleValidate(data)) return

    // start loading
    setLoading(true)

    try {
      // add new account here
      const { message } = await addAccountApi(data)

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setLoading(false)
    }
  }
  console.log('form', form._id)

  return (
    <div className={`${className}`}>
      {/* Type */}
      <div className='mb-5'>
        <div className={`flex`}>
          <span
            className={`inline-flex items-center px-3 rounded-tl-lg rounded-bl-lg border-[2px] text-sm text-gray-900 ${
              errors.type ? 'border-rose-400 bg-rose-100' : 'border-slate-200 bg-slate-100'
            }`}>
            <MdCategory size={19} className='text-secondary' />
          </span>
          <div
            className={`relative w-full border-[2px] border-l-0 bg-white rounded-tr-lg rounded-br-lg ${
              errors.type ? 'border-rose-400' : 'border-slate-200'
            }`}>
            <select
              id='type'
              className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-dark bg-transparent focus:outline-none focus:ring-0 peer'
              disabled={loading}
              {...register('type', { required: true })}>
              <option value=''>Select Type</option>
              {Object.keys(groupTypes)?.map(key => (
                <optgroup label={key} key={key}>
                  {groupTypes[key].map(product => (
                    <option value={product._id} key={product._id}>
                      {product.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* label */}
            <label
              htmlFor='type'
              className={`absolute rounded-md text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 cursor-pointer ${
                errors.type ? 'text-rose-400' : 'text-dark'
              }`}>
              Tye
            </label>
          </div>
        </div>
        {errors.type?.message && (
          <span className='text-sm text-rose-400'>{errors.type?.message?.toString()}</span>
        )}
      </div>

      {/* Info */}
      <Input
        id='info'
        label='Info'
        disabled={loading}
        register={register}
        errors={errors}
        required
        type='textarea'
        rows={8}
        icon={FaInfo}
        onFocus={() => clearErrors('info')}
        className='mb-5'
      />

      {/* Review Time */}
      <Input
        id='renew'
        label='Renew'
        disabled={loading}
        register={register}
        errors={errors}
        required
        type='date'
        icon={FaPlay}
        minDate={new Date().toISOString().split('T')[0]}
        onFocus={() => clearErrors('renew')}
        className='mb-5'
      />

      {/* MARK: Date */}
      <div className='grid grid-cols-2 md:grid-cols-4 mb-5 gap-1 md:gap-0'>
        {/* Days */}
        <Input
          id='days'
          label='Days'
          disabled={loading}
          register={register}
          errors={errors}
          required
          type='number'
          icon={ImClock}
          onFocus={() => clearErrors('days')}
        />
        {/* Hours */}
        <Input
          id='hours'
          label='Hours'
          disabled={loading}
          register={register}
          errors={errors}
          required
          type='number'
          onFocus={() => clearErrors('hours')}
        />
        {/* Minutes */}
        <Input
          id='minutes'
          label='Minutes'
          disabled={loading}
          register={register}
          errors={errors}
          required
          type='number'
          onFocus={() => clearErrors('minutes')}
        />
        {/* Seconds */}
        <Input
          id='seconds'
          label='Seconds'
          disabled={loading}
          register={register}
          errors={errors}
          required
          type='number'
          onFocus={() => clearErrors('seconds')}
        />
      </div>

      {/* Active */}
      <div className='flex mb-5'>
        <div className='bg-white rounded-lg px-3 flex items-center'>
          <FaCheck size={16} className='text-secondary' />
        </div>
        <input
          className='peer'
          type='checkbox'
          id='active'
          hidden
          {...register('active', { required: false })}
        />
        <label
          className={`select-none cursor-pointer border border-green-500 px-4 py-2 rounded-lg common-transition bg-white text-green-500 peer-checked:bg-green-500 peer-checked:text-white`}
          htmlFor='active'>
          Active
        </label>
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        {/* MARK: Add Button */}
        <LoadingButton
          className='px-4 py-2 bg-secondary hover:bg-primary text-light rounded-lg font-semibold common-transition'
          onClick={handleSubmit(onSubmit)}
          text='Add'
          isLoading={loading}
        />

        <button
          className='px-4 py-2 text-sky-300 border border-sky-300 hover:bg-sky-300 hover:text-white rounded-lg font-semibold common-transition'
          onClick={() => handleDuplicateForm(getValues())}>
          Duplicate
        </button>

        <button
          className='px-4 py-2 text-rose-400 border border-rose-400 hover:bg-rose-400 hover:text-white rounded-lg font-semibold common-transition'
          onClick={() => reset({ ...defaultValues, id: new Date().getTime() })}>
          Clear
        </button>

        {index === 0 && (
          <button
            className='px-4 py-2 text-yellow-400 border border-yellow-400 hover:bg-yellow-400 hover:text-white rounded-lg font-semibold common-transition'
            onClick={handleGenerate}>
            Generate
          </button>
        )}

        {forms.length > 1 && (
          <button
            className='px-4 py-2 text-slate-300 border border-slate-300 hover:bg-slate-300 hover:text-dark rounded-lg font-semibold common-transition'
            onClick={() => handleRemoveForm(form.id)}>
            Remove
          </button>
        )}
      </div>
    </div>
  )
}

export default AddAccountForm
