import LoadingPrice from './LoadingPrice'

function LoadingProductCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative w-full h-full min-h-[430px] p-4 bg-white shadow-lg rounded-xl ${className}`}>
      {/* MARK: Thumbnails */}
      <div className='aspect-video rounded-lg shadow-lg loading' />

      {/* Title */}
      <div className='h-2 my-4 loading rounded' />

      {/* Price */}
      <LoadingPrice />

      {/* Basic Information */}
      <div className='flex items-center font-body tracking-wide'>
        <div className='w-4 h-4 rounded-full loading' />
        <div className='h-2 w-[56px] ml-1 loading rounded' />
        <span className='ml-1 w-5 h-4 rounded loading' />
      </div>

      {/* MARK: Action Buttons */}
      <div className='flex items-center justify-end md:justify-start gap-2 mt-2'>
        <div className='loading rounded-md text-white w-[94px] h-[32px]' />
        <div className='loading rounded-md text-white w-[42px] h-[32px]' />
      </div>
    </div>
  )
}

export default LoadingProductCard
