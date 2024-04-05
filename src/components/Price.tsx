import { countPercent, formatPrice } from '@/utils/formatNumber'

interface PriceProps {
  price: number
  oldPrice?: number
  className?: string
}

function Price({ price, oldPrice, className = '' }: PriceProps) {
  return (
    <div
      className={`flex items-center rounded-md flex-wrap justify-evenly px-[6px] py-[5px] bg-slate-100 font-body gap-2 ${className}`}>
      <div className='text-secondary text-[22px] tracking-wide leading-7'>{formatPrice(price)}</div>
      {oldPrice && <div className='text-gray-400 text-[14px] line-through'>{formatPrice(oldPrice)}</div>}
      {oldPrice && (
        <div className='bg-yellow-400 text-[13px] font-semibold rounded-md px-1 py-[2px] text-light font-sans'>
          -{countPercent(price, oldPrice)}
        </div>
      )}
    </div>
  )
}

export default Price
