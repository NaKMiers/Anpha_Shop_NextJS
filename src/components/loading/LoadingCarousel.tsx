import LoadingCarouselProduct from './LoadingCarouselProduct'

function LoadingCarousel({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center h-full pb-4 overflow-x-hidden ${className}`}>
      {Array.from({ length: 14 }).map((_, index) => (
        <LoadingCarouselProduct key={index} />
      ))}
    </div>
  )
}

export default LoadingCarousel
