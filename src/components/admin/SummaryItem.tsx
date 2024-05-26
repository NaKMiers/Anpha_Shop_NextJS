import { IUser } from '@/models/UserModel'
import { IVoucher } from '@/models/VoucherModel'
import { formatPrice } from '@/utils/number'
import { formatDate } from '@/utils/time'
import React from 'react'
import { IoIosSend } from 'react-icons/io'
import { RiDonutChartFill } from 'react-icons/ri'

interface SummaryItemProps {
  data: IUser
  loadingSummaries: string[]
  className?: string

  selectedSummaries: string[]
  setSelectedSummaries: React.Dispatch<React.SetStateAction<string[]>>

  handleSendSummaries: (ids: string[]) => void
}

function SummaryItem({
  data,
  loadingSummaries,
  className = '',
  // selected
  selectedSummaries,
  setSelectedSummaries,
  // functions
  handleSendSummaries,
}: SummaryItemProps) {
  return (
    <div
      className={`relative w-full flex justify items-start gap-2 p-4 rounded-lg shadow-lg cursor-pointer common-transition ${
        selectedSummaries.includes(data._id) ? 'bg-violet-50 -translate-y-1' : 'bg-white'
      }  ${className}`}
      onClick={() =>
        setSelectedSummaries(prev =>
          prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
        )
      }>
      {/* MARK: Body */}
      <div className='w-full'>
        <p className='text-sm'>
          <span className='font-semibold'>Email: </span>
          <span>{data.email}</span>
        </p>

        <div className='flex items-center font-semibold' title='netflix'>
          <span title='Collaborator' className='font-semibold text-secondary mr-2 '>
            {data.firstname && data.lastname
              ? `${data.firstname} ${data.lastname}`
              : data.username || 'No name'}
          </span>
          <span
            className='px-[6px] py-[2px] bg-sky-200 border border-dark rounded-lg shadow-lg text-xs hover:bg-sky-300 common-transition'
            title='Commission'>
            {data.commission?.type === 'percentage'
              ? data.commission.value
              : formatPrice(+(data.commission?.value || 0))}
          </span>
        </div>

        <p className='font-semibold text-sm'>
          All Income: <span className='text-rose-500'>{formatPrice(data.totalIncome)}</span>
        </p>
        <p className='font-semibold text-sm'>
          Temporary Income:{' '}
          <span className='text-sky-500'>
            {formatPrice(
              (data.vouchers as IVoucher[]).reduce((total, voucher) => total + voucher.accumulated, 0)
            )}
          </span>
        </p>
        <p className='font-semibold text-sm'>
          Vouchers:{' '}
          {(data.vouchers as IVoucher[]).map((voucher, index) => (
            <span
              className='text-slate-500'
              title={`${voucher.type} | ${
                voucher.type !== 'percentage' ? formatPrice(+voucher.value) : voucher.value
              } | ${voucher.timesLeft} | ${
                voucher.expire ? formatDate(voucher.expire) : 'no-expire'
              } | ${formatPrice(voucher.minTotal)} | ${formatPrice(voucher.maxReduce)}`}
              key={voucher.code}>
              {voucher.code}
              {index === (data.vouchers as IVoucher[]).length - 1 ? '' : ', '}
            </span>
          ))}
        </p>
      </div>

      {/* MARK: Action Buttons */}
      <div className='flex flex-col flex-shrink-0 border border-dark text-dark rounded-lg p-2 gap-4'>
        {/* Send Summary Button */}
        <button
          className='block group'
          onClick={e => {
            e.stopPropagation()
            handleSendSummaries([data._id])
          }}
          disabled={loadingSummaries.includes(data._id)}
          title='Send'>
          {loadingSummaries.includes(data._id) ? (
            <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
          ) : (
            <IoIosSend size={18} className='wiggle' />
          )}
        </button>
      </div>
    </div>
  )
}

export default SummaryItem
