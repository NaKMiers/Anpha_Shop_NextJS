import { VoucherWithOwner } from '@/app/(admin)/admin/voucher/all/page'
import { formatPrice } from '@/utils/formatNumber'
import { formatTime } from '@/utils/formatTime'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaCheck, FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import { RiDonutChartFill } from 'react-icons/ri'
import ConfirmDialog from '../ConfirmDialog'

interface VoucherItemProps {
  data: VoucherWithOwner
  loadingVouchers: string[]
  className?: string

  selectedVouchers: string[]
  setSelectedVouchers: React.Dispatch<React.SetStateAction<string[]>>

  handleActivateVouchers: (ids: string[], value: boolean) => void
  handleDeleteVouchers: (ids: string[]) => void
}

function VoucherItem({
  data,
  loadingVouchers,
  className = '',
  // selected
  selectedVouchers,
  setSelectedVouchers,
  // functions
  handleActivateVouchers,
  handleDeleteVouchers,
}: VoucherItemProps) {
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  return (
    <>
      <div
        className={`relative flex justify-between items-start gap-2 p-4 rounded-lg text-dark shadow-lg cursor-pointer common-transition ${
          selectedVouchers.includes(data._id) ? 'bg-sky-50 -translate-y-1' : 'bg-white'
        }  ${className}`}
        onClick={() =>
          setSelectedVouchers(prev =>
            prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
          )
        }>
        <div>
          <div className='flex items-center gap-3'>
            {/* Code */}
            <p className='font-semibold text-secondary'>{data.code}</p>

            {/* Value */}
            <p title={data.type} className='font-semibold text-primary'>
              {data.value}
            </p>

            {/* Times Left */}
            <p className='font-semibold text-slate-400' title='timesLeft'>
              {data.timesLeft}
            </p>
          </div>

          <div className='flex items-center gap-3'>
            {/* Min Totals */}
            <p>
              <span className='font-semibold'>Min Total: </span>
              {formatPrice(data.minTotal)}
            </p>

            {/* Max Reduce */}
            <p>
              <span className='font-semibold'>Max Reduce: </span>
              {formatPrice(data.maxReduce)}
            </p>
          </div>

          {/* Begin */}
          <p title='Begin (d/m/y)'>
            <span className='font-semibold'>Begin: </span>
            <span>{formatTime(data.begin)}</span>
          </p>

          {/* Expire */}
          {data.expire && (
            <p title='Expire (d/m/y)'>
              <span className='font-semibold'>Expire: </span>
              <span>{formatTime(data.expire)}</span>
            </p>
          )}

          {/* Desc */}
          {data.desc?.trim() && (
            <p>
              <span className='font-semibold'>Desc: </span>
              <span>{data.desc}</span>
            </p>
          )}

          {/* Owner */}
          <p>
            <span className='font-semibold'>Owner: </span>
            <span>{data.owner?.firstname + ' ' + data.owner?.lastname}</span>
          </p>

          {/* Used Users */}
          {!!data.usedUsers.length && (
            <p>
              <span className='font-semibold'>Used users: </span>
              {data.usedUsers.map((email, index) => (
                <span key={email}>
                  {email} {index < data.usedUsers.length - 1 && ', '}
                </span>
              ))}
            </p>
          )}

          {/* Accumulated */}
          <p className='font-semibold'>
            <span>Accumulated: </span>
            <span className='text-rose-700'>{formatPrice(data.accumulated)}</span>
          </p>
        </div>

        <div className='flex flex-col border border-dark rounded-lg px-2 py-3 gap-4'>
          {/* Active Button */}
          <button
            className='block group'
            onClick={e => {
              e.stopPropagation()
              handleActivateVouchers([data._id], !data.active)
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
            href={`/admin/voucher/${data.code}/edit`}
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
            disabled={loadingVouchers.includes(data._id)}>
            {loadingVouchers.includes(data._id) ? (
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
        title='Delete Voucher'
        content='Are you sure that you want to delete these products?'
        onAccept={() => handleDeleteVouchers([data._id])}
        isLoading={loadingVouchers.includes(data._id)}
      />
    </>
  )
}

export default VoucherItem
