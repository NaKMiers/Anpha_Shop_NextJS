function LoadingCarouselProduct({ className = '' }: { className?: string }) {
  return (
    <div className={`aspect-video w-2/3 sm:w-1/3 lg:w-1/5 shrink-0 px-21/2 ${className}`}>
      <div className='w-full h-full rounded-small loading' />
    </div>
  )
}

export default LoadingCarouselProduct
