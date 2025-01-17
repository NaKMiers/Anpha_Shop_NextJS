import { IAccount } from '@/models/AccountModel'
import { IProduct } from '@/models/ProductModel'
import { getAllAccountsApi } from '@/requests'
import { toUTC } from '@/utils/time'
import moment from 'moment'
import momentTZ from 'moment-timezone'
import Image from 'next/image'
import Link from 'next/link'
import { memo, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

interface RecentlySaleTab {
  searchParams?: { [key: string]: string | string[] }
  className?: string
}

function RecentlySaleTab({ searchParams, className = '' }: RecentlySaleTab) {
  // states
  const [accounts, setAccounts] = useState<IAccount[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)

  // values
  const limit = 15

  // get recently sale accounts
  const getAccounts = useCallback(
    async (page: number) => {
      if (searchParams) {
        searchParams['from-to'] =
          searchParams['from-to'] ||
          `${toUTC(momentTZ(new Date()).startOf('day').toDate())}|${toUTC(momentTZ(new Date()).endOf('day').toDate())}`
      }

      const { 'from-to': fromTo } = searchParams || {}

      // start loading
      setLoading(true)

      try {
        const query = `?limit=${limit}&sort=begin|-1&active=true&usingUser=true&from-to=${fromTo}&page=${page}`
        const { accounts, amount } = await getAllAccountsApi(query)

        return { accounts, amount }
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setLoading(false)
      }
    },
    [searchParams]
  )

  // get recently sale accounts (on mount)
  useEffect(() => {
    // get accounts on mount
    const initialGetAccounts = async () => {
      const { accounts, amount }: any = await getAccounts(1)
      setAccounts(accounts)
      setAmount(amount)
    }

    initialGetAccounts()
  }, [getAccounts])

  // handle load more
  const handleLoadMore = useCallback(async () => {
    const { accounts: newAccounts }: any = await getAccounts(page + 1)
    setPage(page + 1)
    setAccounts(prev => [...prev, ...newAccounts])
  }, [getAccounts, setAccounts, page])

  return (
    <div className={`${className} ${loading ? 'animate-pulse' : ''}`}>
      {accounts.map(account => {
        const minutesAgo = moment().diff(moment(account.begin), 'minutes')

        let color
        if (minutesAgo <= 30) {
          color = 'green-500'
        } else if (minutesAgo <= 60) {
          color = 'sky-500'
        } else if (minutesAgo <= 120) {
          color = 'yellow-400'
        } else {
          color = 'default'
        }

        return (
          <div
            className="mb-2.5 flex gap-2"
            key={account._id}
          >
            <Link
              href={`/${(account.type as IProduct).slug}`}
              className="no-scrollbar flex w-full max-w-[60px] flex-shrink-0 items-start"
            >
              <Image
                className="aspect-video rounded-md shadow-lg"
                src={(account.type as IProduct)?.images[0] || '/images/not-found.jpg'}
                height={60}
                width={60}
                alt="thumbnail"
              />
            </Link>
            <div className="font-body tracking-wider">
              <p className="-mt-1 line-clamp-1 text-ellipsis text-sm font-semibold">
                {(account.type as IProduct).title}
              </p>
              <Link
                href={`/admin/account/all?search=${account.usingUser}`}
                className="line-clamp-1 text-ellipsis text-xs"
              >
                {account.usingUser}
              </Link>
              <p className={`line-clamp-1 text-ellipsis text-xs text-${color}`}>
                {moment(account.begin).format('DD/MM/YYYY HH:mm:ss')}
              </p>
            </div>
          </div>
        )
      })}

      {/* Load More */}
      {amount > limit && (
        <div className="flex items-center justify-center">
          <button
            className={`trans-200 flex h-8 items-center justify-center rounded-md border-2 px-3 text-sm font-semibold text-white hover:bg-white hover:text-dark ${
              loading ? 'pointer-events-none border-slate-400 bg-white' : 'border-dark bg-dark-100'
            }`}
            onClick={handleLoadMore}
          >
            {loading ? (
              <FaCircleNotch
                size={18}
                className="animate-spin text-slate-400"
              />
            ) : (
              <span>({accounts.length}) Load more...</span>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default memo(RecentlySaleTab)
