'use client'

import useUtils from '@/libs/useUtils'
import { memo, useCallback, useState } from 'react'
import { FaCheck, FaCopy } from 'react-icons/fa6'

interface LinkBarProps {
  link: string
  className?: string
}

function LinkBar({ link, className = '' }: LinkBarProps) {
  // states
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const { handleCopy: copy } = useUtils()

  // handle copy
  const handleCopy = useCallback(() => {
    if (!isCopied) {
      copy(link)
      setIsCopied(true)
    }
  }, [link, copy, isCopied])

  return (
    <button
      className={`flex w-full items-center border-[1.5px] ${
        isCopied ? 'border-slate-400' : 'group border-secondary'
      } overflow-hidden rounded-md pr-2 ${className || ''}`}
      onClick={handleCopy}
      disabled={isCopied}
    >
      <div className={`${isCopied ? 'bg-slate-400' : 'bg-secondary'} px-[10px] py-[10px]`}>
        {isCopied ? (
          <FaCheck
            size={18}
            className="wiggle text-white"
          />
        ) : (
          <FaCopy
            size={18}
            className="wiggle text-white"
          />
        )}
      </div>
      <p
        className={`no-scrollbar overflow-x-scroll text-nowrap px-2 text-slate-500 ${
          !isCopied ? 'cursor-pointer' : ''
        }`}
      >
        {link}
      </p>
    </button>
  )
}

export default memo(LinkBar)
