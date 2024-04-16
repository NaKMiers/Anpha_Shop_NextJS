'use client'

import { useCallback, useState } from 'react'
import { toast } from 'react-hot-toast'
import { FaCheck, FaCopy } from 'react-icons/fa6'

interface LinkBarProps {
  link: string
  className?: string
}

function LinkBar({ link, className = '' }: LinkBarProps) {
  // states
  const [isCopied, setIsCopied] = useState<boolean>(false)

  // handle copy
  const handleCopy = useCallback(() => {
    if (!isCopied) {
      navigator.clipboard.writeText(link)
      toast.success('Đã sao chép: ' + link)

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
          <FaCheck size={18} className='text-white wiggle' />
        ) : (
          <FaCopy size={18} className='text-white wiggle' />
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
