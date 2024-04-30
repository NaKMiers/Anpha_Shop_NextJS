'use client'

import { AccountWithProduct } from '@/app/(admin)/admin/account/all/page'
import { getAllAccountsApi } from '@/requests'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

interface RecentlySaleTab {
  className?: string
}

function RecentlySaleTab({ className = '' }: RecentlySaleTab) {
  // states
  const [accounts, setAccounts] = useState<AccountWithProduct[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)

  // get recently sale accounts
  const getAccounts = useCallback(async (page: number) => {
    console.log('Get Recently Sale Accounts')

    // start loading
    setLoading(true)

    try {
      const query = `?limit=15&sort=begin|-1&active=true&usingUser=true&page=${page}`
      const { accounts } = await getAllAccountsApi(query)

      return accounts
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setLoading(false)
    }
  }, [])

  // get recently sale accounts (on mount)
  useEffect(() => {
    // get accounts on mount
    const initialGetAccounts = async () => {
      const accounts = await getAccounts(1)
      setAccounts(accounts)
    }

    initialGetAccounts()
  }, [getAccounts])

  // handle load more
  const handleLoadMore = useCallback(async () => {
    const newAccounts = await getAccounts(page + 1)
    setPage(page + 1)
    setAccounts(prev => [...prev, ...newAccounts])
  }, [getAccounts, setAccounts, page])

  return (
    <div className={`${className}`}>
      {accounts.map(account => {
        const minutesAgo = moment().diff(moment(account.begin), 'minutes')

        let color
        if (minutesAgo <= 30) {
          color = 'green-500' // Màu xanh lá
        } else if (minutesAgo <= 60) {
          color = 'sky-500' // Màu xanh dương
        } else if (minutesAgo <= 120) {
          color = 'yellow-400' // Màu vàng
        } else {
          color = 'default' // Màu mặc định nếu hơn 30 phút
        }

        return (
          <div className='flex gap-3 mb-4' key={account._id}>
            <Link
              href={`/${account.type.slug}`}
              className='flex-shrink-0 flex max-w-[80px] items-start w-full no-scrollbar'>
              <Image
                className='aspect-video rounded-lg shadow-lg'
                src={account.type?.images[0] || '/images/not-found.jpg'}
                height={80}
                width={80}
                alt='thumbnail'
              />
            </Link>
            <div className='font-body tracking-wider'>
              <p className='font-semibold text-ellipsis line-clamp-1 -mt-1.5'>{account.type.title}</p>
              <Link
                href={`/admin/account/all?search=${account.usingUser}`}
                className='text-ellipsis line-clamp-1 text-sm'>
                {account.usingUser}
              </Link>
              <p className={`text-ellipsis line-clamp-1 text-sm text-${color}`}>
                {moment(account.begin).format('DD/MM/YYYY HH:mm:ss')}
              </p>
            </div>
          </div>
        )
      })}

      {/* Load More */}
      <div className='flex items-center justify-center'>
        <button
          className={`flex items-center justify-center font-semibold rounded-md px-3 h-8 text-sm text-white border-2 hover:bg-white hover:text-dark common-transition ${
            loading ? 'pointer-events-none bg-white border-slate-400' : 'bg-dark-100 border-dark'
          }`}
          onClick={handleLoadMore}>
          {loading ? (
            <FaCircleNotch size={18} className='animate-spin text-slate-400' />
          ) : (
            <span>({accounts.length}) Load more...</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default RecentlySaleTab
