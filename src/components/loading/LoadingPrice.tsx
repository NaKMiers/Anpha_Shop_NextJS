interface LoadingPriceProps {
  big?: boolean
  className?: string
}

function LoadingPrice({ big, className = '' }: LoadingPriceProps) {
  return (
    <div className={`rounded-md overflow-hidden mb-2 ${className}`}>
      <div
        className={`flex items-center justify-evenly gap-2 px-1.5 py-2 ${
          big ? 'sm:justify-start sm:gap-4 sm:py-4 sm:px-21' : ''
        } flex-wrap bg-slate-100 font-body`}>
        <div className='h-2 w-24 my-4 loading rounded' />
        <div className='h-2 w-14 my-4 loading rounded' />
        <div
          className={`loading ${
            big ? 'w-12 h-7' : 'w-10 h-6'
          } rounded-md px-1 py-[2px] text-light font-sans`}
        />
      </div>
    </div>
  )
}

export default LoadingPrice
