import React from 'react'

interface LoadingInputProps {
  icon?: React.ElementType
  className?: string

  type?: string
  rows?: number
}

function LoadingInput({ type = 'text', icon: Icon, rows, className = '' }: LoadingInputProps) {
  return (
    <div className={`${className}`}>
      <div className={`flex`}>
        {/* MARK: Icon */}
        {Icon && (
          <span className={`inline-flex items-center px-3 rounded-tl-lg rounded-bl-lg loading mr-px`}>
            <Icon size={19} className='text-white' />
          </span>
        )}

        {/* MARK: Text Field */}
        <div
          className={`relative w-full loading ${Icon ? 'rounded-tr-lg rounded-br-lg' : 'rounded-lg'}`}>
          {type === 'textarea' ? (
            <textarea
              className='block px-2.5 pb-2.5 pt-4 w-full text-sm text-dark bg-transparent focus:outline-none focus:ring-0 peer'
              placeholder=' '
              rows={rows || 4}
            />
          ) : type === 'select' ? (
            <div className='min-h-[46px] w-[152px]' />
          ) : (
            <div className='min-h-[46px] w-full' />
          )}
        </div>
      </div>
    </div>
  )
}

export default LoadingInput
