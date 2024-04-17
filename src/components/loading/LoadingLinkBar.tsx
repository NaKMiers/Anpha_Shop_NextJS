import { FaCheck } from 'react-icons/fa6'

function LoadingLinkBar({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex w-full items-center border-[1.5px] border-slate-400 rounded-md pr-2 overflow-hidden ${className}`}>
      <div className={`loading px-[10px] py-[10px]`}>
        <FaCheck size={18} className='text-white' />
      </div>
    </div>
  )
}

export default LoadingLinkBar
