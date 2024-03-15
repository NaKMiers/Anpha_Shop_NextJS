import React, { useCallback, useState } from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

interface InputProps {
  label: string
  icon: React.ElementType
  className?: string

  id: string
  type?: string
  disabled?: boolean
  required?: boolean
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
}

function Input({
  id,
  type = 'text',
  disabled,
  required,
  register,
  errors,
  label,
  icon: Icon,
  className,
}: InputProps) {
  const [isShowPassword, setIsShowPassword] = useState(false)

  const handleShowPassword = useCallback(() => {
    setIsShowPassword(prev => !prev)
  }, [])

  return (
    <div className={`${className}`}>
      <div className={`flex`}>
        <span
          onClick={type === 'password' ? handleShowPassword : undefined}
          className={`inline-flex items-center px-3 rounded-tl-lg rounded-bl-lg border-[2px] text-sm text-gray-900 ${
            errors[id] ? 'border-rose-400 bg-rose-100' : 'border-slate-200 bg-slate-100'
          } ${type === 'password' ? 'cursor-pointer' : ''}`}>
          {type === 'password' ? (
            isShowPassword ? (
              <FaEye size={19} className='text-secondary' />
            ) : (
              <Icon size={19} className='text-secondary' />
            )
          ) : (
            <Icon size={19} className='text-secondary' />
          )}
        </span>
        <div
          className={`relative w-full border-[2px] border-l-0 rounded-tr-lg rounded-br-lg bg-white ${
            errors[id] ? 'border-rose-400' : 'border-slate-200'
          }`}>
          <input
            id={id}
            className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-dark bg-transparent focus:outline-none focus:ring-0 peer'
            placeholder=' '
            disabled={disabled}
            type={type === 'password' ? (isShowPassword ? 'text' : 'password') : type}
            {...register(id, { required })}
          />
          {/* label */}
          <label
            htmlFor={id}
            className={`absolute rounded-md text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 cursor-pointer ${
              errors[id] ? 'text-rose-400' : 'text-dark'
            }`}>
            {label}
          </label>
        </div>
      </div>
      {errors[id]?.message && (
        <span className='text-sm text-rose-400'>{errors[id]?.message?.toString()}</span>
      )}
    </div>
  )
}

export default Input
