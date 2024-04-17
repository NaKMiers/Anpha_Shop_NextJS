function LoadingPagination({ className = '' }: { className?: string }) {
  return (
    <div className={`flex font-semibold gap-2 justify-center ${className}`}>
      {/* MARK: Prev */}
      <div className='rounded-lg loading w-[50px] h-[40px] border-2 border-white' />

      {/* MARK: 1 ... n */}
      <div className='flex gap-2 no-scrollbar overflow-x-scroll'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div className='rounded-lg loading w-[40px] h-[40px] border-2 border-white' key={index} />
        ))}
      </div>

      {/* MARK: Next */}
      <div className='rounded-lg loading w-[50px] h-[40px] border-2 border-white' />
    </div>
  )
}

export default LoadingPagination
