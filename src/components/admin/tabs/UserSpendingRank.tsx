import { IUser } from '@/models/UserModel'
import { formatPrice } from '@/utils/number'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useState } from 'react'

interface UserSpendingRankTabProps {
  users: any[]
  className?: string
}

function UserSpendingRankTab({ users: data, className = '' }: UserSpendingRankTabProps) {
  // states
  const [chunk, setChunk] = useState<number>(20)
  const [users, setUsers] = useState<any[]>(data.slice(0, chunk))

  // values
  const colors = ['orange-500', 'sky-500', 'green-500', 'yellow-500', 'pink-500']

  // handle loading more
  const handleLoadMore = useCallback(() => {
    setChunk(chunk + 10)
    setUsers(data.slice(0, chunk + 10))
  }, [chunk, data])

  return (
    <div className={`${className}`}>
      {users.map((user, index) => (
        <div className='flex gap-3 mb-4' key={index}>
          <Link href='/' className='relative aspect-square text-white'>
            <Image className='rounded-lg' src={user.avatar} width={45} height={45} alt='thumbnail' />
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
              <span className='text-sm text-slate-400'>({user.email})</span>
            </p>
            <p className='text-yellow-500'>{formatPrice(user.totalSpent)}</p>
          </div>
        </div>
      ))}

      {/* Loading More */}
      <div className='flex items-center justify-center'>
        <button
          className={`flex items-center justify-center font-semibold rounded-md px-3 h-8 text-sm text-white border-2 hover:bg-white hover:text-dark common-transition bg-dark-100 border-dark`}
          onClick={handleLoadMore}>
          <span>({users.length}) Load more...</span>
        </button>
      </div>
    </div>
  )
}

export default UserSpendingRankTab
