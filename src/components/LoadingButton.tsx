import React from 'react'
import { RiDonutChartFill } from 'react-icons/ri'

interface LoadingButtonProps {
  text: string
  isLoading: boolean
  onClick?: () => void
  className?: string
}

function LoadingButton({ text, isLoading, onClick, className }: LoadingButtonProps) {
  return (
    <button
      className={`${isLoading ? 'bg-slate-300 pointer-events-none' : ''} ${className}`}
      disabled={isLoading}
      onClick={onClick}>
      {isLoading ? <RiDonutChartFill size={24} className='animate-spin' /> : text}
    </button>
  )
}

export default LoadingButton
