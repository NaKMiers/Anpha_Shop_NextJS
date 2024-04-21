import { AccountWithProduct } from '@/app/(admin)/admin/account/all/page'
import { formatTime, getColorClass, getTimeRemaining, usingPercentage } from '@/utils/time'
import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCheck, FaCopy, FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../ConfirmDialog'
import moment from 'moment'

interface AccountItemProps {
  data: AccountWithProduct
  loadingAccounts: string[]
  className?: string

  selectedAccounts: string[]
  setSelectedAccounts: React.Dispatch<React.SetStateAction<string[]>>

  handleActivateAccounts: (ids: string[], value: boolean) => void
  handleDeleteAccounts: (ids: string[]) => void
}

function AccountItem({
  data,
  loadingAccounts,
  className = '',
  // selected
  selectedAccounts,
  setSelectedAccounts,
  // functions
  handleActivateAccounts,
  handleDeleteAccounts,
}: AccountItemProps) {
  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // handle copy
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Đã sao chép: ' + text)
  }, [])

  return (
    <>
      <div
        className={`relative w-full flex items-start gap-2 p-4 rounded-lg shadow-lg cursor-pointer common-transition ${
          selectedAccounts.includes(data._id) ? 'bg-violet-50 -translate-y-1' : 'bg-white'
        }  ${className}`}
        onClick={() =>
          setSelectedAccounts(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }>
        <div className='w-[calc(100%_-_42px)]'>
          {/* MARK: Thumbnails */}
          <Link
            href={`/${data.type?.slug || ''}`}
            prefetch={false}
            onClick={e => e.stopPropagation()}
            className='mr-4 flex items-center max-w-[160px] rounded-lg shadow-md overflow-hidden mb-2'>
            <div className='flex items-center w-full overflow-x-scroll snap-x snap-mandatory no-scrollbar'>
              <Image
                className='aspect-video flex-shrink-0 snap-start object-cover w-full h-full'
                src={data.type?.images[0] || '/images/not-found.jpg'}
                height={200}
                width={200}
                alt='thumbnail'
              />
            </div>
          </Link>

          {/* Using User */}
          <div
            className={`absolute z-10 -top-3 left-1/2 -translate-x-1/2 shadow-md text-sm text-dark  px-2 py-[2px] select-none rounded-lg font-body ${
              data.usingUser ? 'bg-secondary text-white' : 'bg-slate-300 text-slate-400'
            }`}
            onClick={e => {
              e.stopPropagation()
              data.usingUser && handleCopy(data.usingUser)
            }}>
            {data.usingUser ? data.usingUser : '___'}
          </div>

          {/* Type */}
          <p
            className='inline-flex mb-2 flex-wrap gap-2 items-center font-semibold text-[18px] mr-2 leading-5 font-body tracking-wide'
            title={data.type?.title}>
            <span
              className={`shadow-md text-xs ${
                data.type?.category.title ? 'bg-yellow-300 text-dark' : 'bg-slate-200 text-slate-400'
              } px-2 py-px select-none rounded-md font-body`}>
              {data.type?.category.title || 'empty'}
            </span>
            {data.type?.title}
          </p>

          {/* Begin */}
          <p className='text-sm' title='Begin (d/m/y)'>
            <span className='font-semibold'>Begin: </span>
            <span>{data.begin ? formatTime(data.begin) : '-'}</span>
          </p>

          {/* Expire */}
          <p className='text-sm' title='Expire (d/m/y)'>
            <span className='font-semibold'>Expire: </span>
            {data.expire ? (
              <>
                <span
                  className={`${
                    new Date() > new Date(data.expire || '') ? 'text-red-500 font-semibold' : ''
                  }`}>
                  {data.expire ? formatTime(data.expire) : '-'}
                </span>{' '}
                {data?.begin && data?.expire && usingPercentage(data.begin, data.expire) < 100 && (
                  <span
                    className={`font-semibold text-xs ${getColorClass(data.begin, data.expire)}`}
                    title={`${
                      usingPercentage(data.begin, data.expire) >= 93
                        ? '>= 93'
                        : usingPercentage(data.begin, data.expire) >= 80
                        ? '>= 80'
                        : ''
                    }`}>
                    (<span>{usingPercentage(data.begin, data.expire) + '%'}</span>
                    {' - '}
                    <span>
                      {data.expire && getTimeRemaining(data.expire)
                        ? `${getTimeRemaining(data.expire)}`
                        : 'Expired'}
                    </span>
                    )
                  </span>
                )}{' '}
              </>
            ) : (
              <span className='text-slate-500'>
                +{data.times.days ? data.times.days + 'd' : ''}
                {data.times.hours ? ':' + data.times.hours + 'h' : ''}
                {data.times.minutes ? ':' + data.times.minutes + 'm' : ''}
              </span>
            )}
          </p>

          {/* Renew */}
          <p className='text-sm' title='Expire (d/m/y)'>
            <span className='font-semibold'>Renew: </span>
            <span className={`${new Date() > new Date(data.renew) ? 'text-red-500 font-semibold' : ''}`}>
              {formatTime(data.renew)}
            </span>
          </p>

          {/* Updated  */}
          <p className='text-sm' title='Expire (d/m/y)'>
            <span className='font-semibold'>Updated: </span>
            <span
              className={`${
                +new Date() - +new Date(data.updatedAt) <= 60 * 60 * 1000 ? 'text-yellow-500' : ''
              }`}>
              {formatTime(data.updatedAt)}
            </span>
          </p>

          {/* Info */}
          <div className='relative w-full mt-2 max-h-[200px] border rounded-lg'>
            <button
              className='group absolute top-1.5 right-1.5 rounded-md border p-1.5 text-slate-500'
              onClick={e => {
                e.stopPropagation()
                handleCopy(data.info)
              }}>
              <FaCopy size={16} className='wiggle' />
            </button>
            <p className='p-2 text-sm font-body tracking-wide overflow-auto whitespace-pre break-all'>
              {data.info.split('\n').map((line, index) => (
                <span key={index} className='block'>
                  {line.split(' ').map((word, index) => (
                    <span
                      key={index}
                      className='inline-block cursor-pointer'
                      onClick={e => {
                        e.stopPropagation()
                        handleCopy(word)
                      }}>
                      {word}{' '}
                    </span>
                  ))}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* MARK: Action Buttons */}
        <div className='flex flex-col flex-shrink-0 border border-dark text-dark rounded-lg px-2 py-3 gap-4'>
          {/* Active Button */}
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              handleActivateAccounts([data._id], !data.active)
            }}
            title={data.active ? 'Deactivate' : 'Activate'}>
            <FaCheck
              size={18}
              className={`group-hover:scale-125 common-transition ${
                data.active ? 'text-green-500' : 'text-slate-300'
              }`}
            />
          </button>

          {/* Edit Button Link */}
          <Link
            href={`/admin/account/${data._id}/edit`}
            className='block group'
            title='Edit'
            onClick={e => e.stopPropagation()}>
            <MdEdit size={18} className='group-hover:scale-125 common-transition' />
          </Link>

          {/* Delete Button */}
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              setIsOpenConfirmModal(true)
            }}
            disabled={loadingAccounts.includes(data._id)}
            title='Delete'>
            {loadingAccounts.includes(data._id) ? (
              <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
            ) : (
              <FaTrash size={18} className='group-hover:scale-125 common-transition' />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title='Delete Account'
        content='Are you sure that you want to delete this account?'
        onAccept={() => handleDeleteAccounts([data._id])}
        isLoading={loadingAccounts.includes(data._id)}
      />
    </>
  )
}

export default AccountItem
