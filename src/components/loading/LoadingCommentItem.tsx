import { FaHeart, FaSortDown } from 'react-icons/fa'

function CommentItem({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full flex items-start gap-3 ${className}`}>
      <div className='w-[40px] h-[40px] flex-shrink-0 rounded-full loading' />

      <div className='flex flex-col gap-2 pt-1 w-full'>
        {/* MARK: Headline */}
        <div className='flex items-center gap-3'>
          <span className='h-2 w-[100px] loading rounded' />
          <span className='h-2 w-[100px] loading rounded' />
        </div>

        {/* MARK: Content */}
        <p className='h-2 w-full max-w-[400px] loading rounded' />

        {/* MARK: Actions */}
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-1'>
            <FaHeart size={14} className='text-loading animate-pulse' />
            <span className='h-2 w-[25px] loading rounded' />
          </div>

          <div className='flex items-center gap-2'>
            <span className='h-2 w-[25px] loading rounded' />
            <span className='h-2 w-[75px] loading rounded' />
            <FaSortDown size={16} className='text-loading animate-pulse mt-[-7px]' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentItem
