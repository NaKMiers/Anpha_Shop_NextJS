import { AccountWithProduct } from '@/app/(admin)/admin/account/all/page'
import { formatTime } from '@/utils/time'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaCheck, FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../ConfirmDialog'

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
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  return (
    <>
      <div
        className={`relative w-full flex justify items-start gap-2 p-4 rounded-lg shadow-lg cursor-pointer common-transition ${
          selectedAccounts.includes(data._id) ? 'bg-sky-50 -translate-y-1' : 'bg-white'
        }  ${className}`}
        onClick={() =>
          setSelectedAccounts(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }>
        <div className='w-full'>
          {/* Thumbnails */}
          <Link
            href={`/${data.type.slug}`}
            className='float-left mr-4 flex items-center max-w-[160px] rounded-lg shadow-md overflow-hidden mb-2'>
            <div className='flex items-center w-full overflow-x-scroll snap-x no-scrollbar'>
              <Image
                className='aspect-video flex-shrink-0 snap-start'
                src={data.type.images[0]}
                height={200}
                width={200}
                alt='thumbnail'
              />
            </div>
          </Link>

          {/* Using User */}
          <div
            className={`absolute z-10 -top-2 left-1/2 -translate-x-1/2 shadow-md text-sm text-dark  px-2 py-[2px] select-none rounded-lg font-body ${
              data.usingUser ? 'bg-secondary text-white' : 'bg-slate-300 text-slate-400'
            }`}>
            {data.usingUser ? data.usingUser : '___'}
          </div>

          {/* Type */}
          <p
            className='inline-flex mb-2 flex-wrap gap-2 items-center font-semibold text-[18px] mr-2 leading-5 font-body tracking-wide'
            title='Type---'>
            <span className='shadow-md text-xs text-dark bg-yellow-400 px-2 py-px select-none rounded-md font-body'>
              Netflix
            </span>
            {data.type.title}
          </p>

          {/* Begin */}
          <p className='text-sm' title='Begin (d/m/y)'>
            <span className='font-semibold'>Begin: </span>
            <span>{data.begin ? formatTime(data.begin) : '-'}</span>
          </p>

          {/* Expire */}
          <p className='text-sm' title='Expire (d/m/y)'>
            <span className='font-semibold'>Expire: </span>
            <span className={`${new Date() > new Date(data.expire || '') ? 'text-red-500' : ''}`}>
              {data.expire ? formatTime(data.expire) : '-'}
            </span>
          </p>

          {/* Renew */}
          <p className='text-sm' title='Expire (d/m/y)'>
            <span className='font-semibold'>Renew: </span>
            <span className={`${new Date() > new Date(data.renew) ? 'text-red-500' : ''}`}>
              {formatTime(data.renew)}
            </span>
          </p>

          {/* Info */}
          <p className='w-full mt-2 max-h-[200px] font-body tracking-wide overflow-auto'>{data.info}</p>
        </div>

        <div className='flex flex-col flex-shrink-0 border border-dark text-dark rounded-lg px-2 py-3 gap-4'>
          {/* Active Button */}
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              handleActivateAccounts([data._id], !data.active)
            }}>
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
            disabled={loadingAccounts.includes(data._id)}>
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
