'use client'

import { useCallback, useState } from 'react'
import Toast from 'react-hot-toast'
import { FaCheck, FaCopy } from 'react-icons/fa6'

interface LinkBarProps {
  link: string
  className?: string
}

function LinkBar({ link, className = '' }: LinkBarProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = useCallback(() => {
    if (!isCopied) {
      var textField = document.createElement('textarea')
      textField.innerText = link
      document.body.appendChild(textField)
      textField.select()
      document.execCommand('copy')
      textField.remove()

      Toast.success('Đã sao chép ' + link)

      setIsCopied(true)
    }
  }, [link, isCopied])

  return (
    <button
      className={`flex w-full items-center border-[1.5px] ${
        isCopied ? 'border-slate-400' : 'border-secondary group'
      } rounded-md pr-2 overflow-hidden ${className || ''}`}
      onClick={handleCopy}
      disabled={isCopied}>
      <div className={`${isCopied ? 'bg-slate-400' : 'bg-secondary'} px-[10px] py-[10px]`}>
        {isCopied ? (
          <FaCheck size={18} className='text-white group-hover:scale-110 common-transition' />
        ) : (
          <FaCopy size={18} className='text-white group-hover:scale-110 common-transition' />
        )}
      </div>
      <p
        className={`overflow-x-scroll text-nowrap no-scrollbar px-2 text-slate-500 ${
          !isCopied ? 'cursor-pointer' : ''
        }`}>
        {link}
      </p>
    </button>
  )
}

export default LinkBar
