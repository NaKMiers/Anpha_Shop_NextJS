'use client'

import { handleQuery } from '@/utils/handleQuery'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'

interface PaginationProps {
  searchParams: { [key: string]: string[] | string } | undefined
  amount: number
  itemsPerPage: number
  className?: string
}

function Pagination({
  searchParams = {},
  amount = 0,
  itemsPerPage = 9, // default item/page
  className = '',
}: PaginationProps) {
  // hook
  const pathname = usePathname()
  const router = useRouter()
  const queryParams = useSearchParams()
  const page = queryParams.get('page')

  // calculate page amount
  const pageAmount = Math.ceil(amount / itemsPerPage)
  const currentPage = page ? +page : 1

  // set page link
  const getPageLink = useCallback(
    (value: number) => {
      // get page from searchParams
      if (searchParams.page) {
        delete searchParams.page
      }
      searchParams.page = [value.toString()]

      return pathname + handleQuery(searchParams)
    },
    [searchParams, pathname]
  )

  // keyboard event
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // left arrow
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        router.push(getPageLink(currentPage - 1))
      }

      // right arrow
      if (e.key === 'ArrowRight' && currentPage < pageAmount) {
        router.push(getPageLink(currentPage + 1))
      }
    }

    window.addEventListener('keydown', handleKeydown)

    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [currentPage, pageAmount, router, getPageLink])

  return (
    pageAmount > 1 && (
      <div className={`flex font-semibold gap-2 justify-center ${className}`}>
        {currentPage != 1 && (
          <Link
            href={getPageLink(currentPage <= 1 ? 1 : currentPage - 1)}
            className='rounded-lg border-2 py-[6px] px-2 bg-white hover:bg-secondary hover:text-light common-transition border-white'
            title={`👈 Trang ${currentPage <= 1 ? 1 : currentPage - 1}`}>
            Trước
          </Link>
        )}

        <div className='flex gap-2 no-scrollbar overflow-x-scroll'>
          {Array.from({ length: pageAmount }).map((_, index) => (
            <Link
              href={getPageLink(index + 1)}
              className={`rounded-lg border-2 py-[6px] px-4 hover:bg-secondary hover:text-light common-transition border-white text-dark ${
                currentPage === index + 1 ? 'bg-primary border-primary' : 'bg-white'
              }`}
              key={index}>
              {index + 1}
            </Link>
          ))}
        </div>

        {currentPage != pageAmount && (
          <Link
            href={getPageLink(currentPage >= pageAmount ? pageAmount : currentPage + 1)}
            className='rounded-lg border-2 py-[6px] px-2 bg-white hover:bg-secondary hover:text-light common-transition border-white'
            title={`👉 Trang ${currentPage >= pageAmount ? pageAmount : currentPage + 1}`}>
            Sau
          </Link>
        )}
      </div>
    )
  )
}

export default Pagination
