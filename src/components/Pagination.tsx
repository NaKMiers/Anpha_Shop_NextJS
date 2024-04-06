import { handleQuery } from '@/utils/handleQuery'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface PaginationProps {
  searchParams: { [key: string]: string[] } | undefined
  amount: number
  itemsPerPage: number
  className?: string
}

function Pagination({
  searchParams = {},
  amount = 0,
  itemsPerPage = 9,
  className = '',
}: PaginationProps) {
  // hook
  const pathname = usePathname()
  const router = useRouter()

  // calculate page amount
  const pageAmount = Math.ceil(amount / itemsPerPage)
  const currentPage = searchParams.page ? +searchParams.page[0] : 1

  console.log('pageAmount: ', pageAmount)

  const handlePage = (page: number, next: number = 0) => {
    console.log('handlePage: ', page)
    // get page from searchParams
    if (searchParams.page) {
      delete searchParams.page
    }

    // add page to searchParams
    searchParams.page = [
      (next != 0
        ? currentPage + next < 1
          ? 1
          : currentPage + next > pageAmount
          ? pageAmount
          : currentPage + next
        : page
      ).toString(),
    ]

    // handle query
    const query = handleQuery(searchParams)

    // push to router
    router.push(pathname + query)
  }

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        // check page
        if (currentPage - 1 < 1) return
        handlePage(0, -1)
      } else if (e.key === 'ArrowRight') {
        // check current page
        if (currentPage + 1 > pageAmount) return
        handlePage(0, 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  return (
    pageAmount > 1 && (
      <div className={`flex font-semibold gap-2 justify-center ${className}`}>
        {currentPage != 1 && (
          <button
            className='rounded-lg border-2 py-[6px] px-2 bg-white hover:bg-secondary hover:text-light common-transition border-white'
            title='👈 Previous'
            onClick={() => handlePage(0, -1)}>
            Trước
          </button>
        )}

        <div className='flex gap-2 no-scrollbar overflow-x-scroll'>
          {Array.from({ length: pageAmount }).map((_, index) => (
            <button
              className={`rounded-lg border-2 py-[6px] px-4 hover:bg-secondary hover:text-light common-transition border-white text-dark ${
                currentPage === index + 1 ? 'bg-primary border-primary' : 'bg-white'
              }`}
              key={index}
              onClick={() => handlePage(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>

        {currentPage != pageAmount && (
          <button
            className='rounded-lg border-2 py-[6px] px-2 bg-white hover:bg-secondary hover:text-light common-transition border-white'
            title='👉 Next'
            onClick={() => handlePage(0, 1)}>
            Sau
          </button>
        )}
      </div>
    )
  )
}

export default Pagination
