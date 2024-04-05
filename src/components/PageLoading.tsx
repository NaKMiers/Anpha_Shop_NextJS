'use client'

import { useAppSelector } from '@/libs/hooks'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

function Loading() {
  const isPageLoading = useAppSelector(state => state.modal.isPageLoading)

  return (
    <div
      className={`${
        isPageLoading ? 'flex' : 'hidden'
      } items-center justify-center fixed z-40 w-screen h-screen top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30`}>
      <AiOutlineLoading3Quarters size={48} className='text-light animate-spin' />
    </div>
  )
}

export default Loading
