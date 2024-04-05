interface PaginationProps {
  className?: string
}

function Pagination({ className = '' }: PaginationProps) {
  return (
    <div className='flex font-semibold gap-2 justify-center'>
      <button className='rounded-lg border-2 py-[6px] px-2 bg-white hover:bg-secondary hover:text-light common-transition border-white'>
        Trước
      </button>

      <div className='flex gap-2 no-scrollbar overflow-x-scroll'>
        {Array.from({ length: 5 }).map((_, index) => (
          <button
            key={index}
            className='rounded-lg border-2 py-[6px] px-4 bg-white hover:bg-secondary hover:text-light common-transition border-white text-dark'>
            {index}
          </button>
        ))}
      </div>

      <button className='rounded-lg border-2 py-[6px] px-2 bg-white hover:bg-secondary hover:text-light common-transition border-white'>
        Sau
      </button>
    </div>
  )
}

export default Pagination
