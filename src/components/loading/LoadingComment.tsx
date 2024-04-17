import LoadingCommentItem from './LoadingCommentItem'

function Comment({ className = '' }: { className?: string }) {
  return (
    <div>
      {/* MARK: Input */}
      <div className={`flex items-center justify-between gap-3 ${className}`}>
        <div className='w-[40px] h-[40px] flex-shrink-0 rounded-full loading' />
        <div className='w-full rounded-lg'>
          <div className='rounded-lg loading w-full h-[40px]' />
        </div>

        <div className='h-[40px] w-[78px] rounded-lg loading' />
      </div>

      {/* MARK: Comment List */}
      <div className='flex flex-col mt-5 gap-4 max-h-[500px] overflow-y-scroll'>
        {Array.from({ length: 5 }).map((_, index) => (
          <LoadingCommentItem key={index} />
        ))}
      </div>
    </div>
  )
}

export default Comment
