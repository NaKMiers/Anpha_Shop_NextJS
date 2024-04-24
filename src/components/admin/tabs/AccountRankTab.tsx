import { AccountWithProduct } from '@/app/(admin)/admin/account/all/page'
import Divider from '@/components/Divider'
import { formatPrice } from '@/utils/number'

interface AccountRankTabProps {
  accounts: AccountWithProduct[]
  className?: string
}

function AccountRankTab({ accounts, className = '' }: AccountRankTabProps) {
  return (
    <div className={`${className}`}>
      <select
        className='appearance-none p-2.5 font-semibold text-xs bg-dark-100 text-white focus:outline-none focus:ring-0 peer rounded-lg cursor-pointer'
        defaultValue={'month'}>
        <option
          className='bg-dark-100 text-white font-body font-semibold tracking-wider p-5'
          value='day'>
          By Day
        </option>
        <option
          className='bg-dark-100 text-white font-body font-semibold tracking-wider p-5'
          value='month'>
          By Month
        </option>
        <option
          className='bg-dark-100 text-white font-body font-semibold tracking-wider p-5'
          value='year'>
          By Year
        </option>
      </select>

      <Divider size={4} />

      {Array.from({ length: 10 }).map((_, index) => (
        <div className='flex items-center gap-3 mb-3' key={index}>
          <span className='text-white bg-slate-700 px-2 py-[2px] rounded-lg'>anphashop79@gmail.com</span>
          <span className='text-green-500 text-sm font-semibold'>{formatPrice(1700000)}</span>
          <span
            className={`shadow-md text-xs bg-yellow-300 text-dark px-2 py-[2px] select-none rounded-md font-body`}>
            Netflix
          </span>
        </div>
      ))}
    </div>
  )
}

export default AccountRankTab
