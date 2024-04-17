import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import LoadingProductCard from './LoadingProductCard'

interface GroupProductsProps {
  hideTop?: boolean
  bestSeller?: boolean
  className?: string
}

function LoadingGroupProducts({ hideTop, bestSeller, className = '' }: GroupProductsProps) {
  return (
    <div className={`relative ${className}`}>
      {/* MARK: Ears */}
      {!hideTop && (
        <div className={`flex ${!bestSeller ? 'justify-between' : 'justify-end'} px-6`}>
          {!bestSeller && (
            <div className='flex gap-2 py-2 px-3 items-center bg-white rounded-t-xl border-b-2 opacity-90 group'>
              <div className='aspect-square items-center w-6 h-6 loading rounded-full' />
              <span className='w-16 h-2 rounded loading' />
            </div>
          )}
          <div className='flex gap-2 py-2 px-3 items-center bg-white rounded-t-xl border-b-2 opacity-90'>
            <span className='w-16 h-2 rounded loading' />
          </div>
        </div>
      )}

      <div className='group flex items-center justify-center absolute -left-21 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 w-10 h-11 z-10 rounded-l-small shadow-md'>
        <FaChevronLeft size={18} className='text-dark' />
      </div>
      <div className='group flex items-center justify-center absolute -right-21 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 w-10 h-11 z-10 rounded-r-small shadow-md'>
        <FaChevronRight size={18} className='text-dark' />
      </div>

      {/* MARK: Slider */}
      <div className='flex flex-wrap min-h-[490px] px-21/2 bg-white bg-opacity-90 rounded-medium shadow-medium'>
        <div className='flex w-full py-21 overflow-hidden'>
          {Array.from({ length: 10 }).map((_, index) => {
            const color =
              index <= 2 ? (index <= 1 ? (index <= 0 ? '#f44336' : 'orange') : 'lightgreen') : '#0dcaf0'

            return (
              <div
                key={index}
                className='relative flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-21/2 snap-start'>
                {bestSeller && (
                  <div
                    className='absolute z-20 right-1 font-[700] rotate-[10deg]'
                    style={{
                      color,
                      fontSize:
                        index <= 2 ? (index <= 1 ? (index <= 0 ? '56px' : '48px') : '40px') : '32px',
                      top:
                        index <= 2 ? (index <= 1 ? (index <= 0 ? '-30px' : '-26px') : '-22px') : '-13px',
                    }}>
                    #{index + 1}
                  </div>
                )}
                <LoadingProductCard />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default LoadingGroupProducts
