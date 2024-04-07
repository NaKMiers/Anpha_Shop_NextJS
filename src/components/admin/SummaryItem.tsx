import { UserWithVouchers } from '@/app/api/admin/summary/all/route'
import { formatPrice } from '@/utils/number'
import React from 'react'
import { IoIosSend } from 'react-icons/io'
import { RiDonutChartFill } from 'react-icons/ri'

interface SummaryItemProps {
  data: UserWithVouchers
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
        selectedSummaries.includes(data._id) ? 'bg-sky-50 -translate-y-1' : 'bg-white'
      }  ${className}`}
      onClick={() =>
        setSelectedSummaries(prev =>
          prev.includes(data._id) ? prev.filter(id => id !== data._id) : [...prev, data._id]
        )
      }>
      <div className='w-full'>
        <p>
          <span className='font-semibold'>Email: </span>
          <span>hothingoctram03@gmail.com</span>
        </p>

        <div className='flex items-center font-semibold' title='netflix'>
          <span title='Collaborator' className='font-semibold text-xl text-secondary mr-2 '>
            {data.firstname && data.lastname
              ? `${data.firstname} ${data.lastname}`
              : data.username || 'No name'}
          </span>
          <span
            className='px-[6px] py-[2px] bg-sky-200 border border-dark rounded-full shadow-lg text-sm hover:bg-sky-300 common-transition'
            title='Commission'>
            {data.commission?.type === 'percentage'
              ? data.commission.value
              : formatPrice(+(data.commission?.value || 0))}
          </span>
        </div>

        <p className='font-semibold'>
          All Income: <span className='text-xl text-rose-500'>{formatPrice(data.totalIncome)}</span>
        </p>
        <p className='font-semibold'>
          Month Income:{' '}
          <span className='text-xl text-sky-500'>
            {formatPrice(data.vouchers.reduce((total, voucher) => total + voucher.accumulated, 0))}
          </span>
        </p>
      </div>

      <div className='flex flex-col flex-shrink-0 border border-dark text-dark rounded-lg px-2 py-3 gap-4'>
        {/* Send Summary Button */}
        <button
          className='block group'
          onClick={e => {
            e.stopPropagation()
            handleSendSummaries([data._id])
          }}
          disabled={loadingSummaries.includes(data._id)}>
          {loadingSummaries.includes(data._id) ? (
            <RiDonutChartFill size={18} className='animate-spin text-slate-300' />
          ) : (
            <IoIosSend size={18} className='group-hover:scale-125 common-transition' />
          )}
        </button>
      </div>
    </div>
  )
}

export default SummaryItem
