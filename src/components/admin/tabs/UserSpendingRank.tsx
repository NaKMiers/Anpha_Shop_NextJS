import { getRankUsersApi } from '@/requests'
import { formatPrice } from '@/utils/number'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

interface UserSpendingRankTabProps {
  className?: string
}

function UserSpendingRankTab({ className = '' }: UserSpendingRankTabProps) {
  // states
  const [loading, setLoading] = useState<boolean>(false)
  const [chunk, setChunk] = useState<number>(20)
  const [users, setUsers] = useState<any[]>([])
  const [showUsers, setShowUsers] = useState<any[]>([])

  // values
  const colors = ['orange-500', 'sky-500', 'green-500', 'yellow-500', 'pink-500']

  useEffect(() => {
    const getRankUsers = async () => {
      // start loading
      setLoading(true)

      try {
        const { spentUser } = await getRankUsersApi()
        console.log('spentUser', spentUser)

        setUsers(spentUser)
        setShowUsers(spentUser.slice(0, 20))
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setLoading(false)
      }
    }
    getRankUsers()
  }, [])

  // handle loading more
  const handleLoadMore = useCallback(() => {
    setChunk(chunk + 10)
    setShowUsers(users.slice(0, chunk + 10))
  }, [chunk, users])

  return (
    <div className={`${className}`}>
      {showUsers.map((user, index) => (
        <div className='flex gap-3 mb-4' key={index}>
          <Link href='/' className='flex-shrink-0 relative aspect-square text-white'>
            <Image
              className='rounded-lg'
              src={user.avatar || process.env.NEXT_PUBLIC_DEFAULT_AVATAR}
              width={45}
              height={45}
              alt='thumbnail'
            />
            {index < 10 && (
              <span
                className={`absolute top-0 -right-1.5 font-semibold italic bg-dark-100 h-5 min-w-5 flex items-center justify-center px-1.5 rounded-full text-sm text-${colors[index]}`}>
                {index + 1 <= 10 ? index + 1 : ''}
              </span>
            )}
          </Link>
          <div className='font-body tracking-wider'>
            <p className='font-semibold'>
              {user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username}{' '}
              <span className='text-sm text-slate-400 '>({user.email})</span>
            </p>
            <p className='text-yellow-500'>{formatPrice(user.spent)}</p>
          </div>
        </div>
      ))}

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
            <span>({showUsers.length}) Load more...</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default UserSpendingRankTab
