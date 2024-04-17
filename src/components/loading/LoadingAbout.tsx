import Slider from '../Slider'

function LoadingAbout({ className = '' }: { className?: string }) {
  return (
    <section className={`max-w-1200 mx-auto ${className}`}>
      <Slider time={10000} className='bg-white bg-opacity-90 rounded-medium shadow-medium'>
        {/* MARK: slide 1 */}
        <div className='flex gap-y-4 flex-wrap h-full p-21'>
          <div className='w-full md:w-2/3 rounded-lg loading aspect-video' />
          <div className='w-full md:w-1/3 md:pl-21 pb-16 md:pb-0'>
            {Array.from({ length: 10 }).map((_, index) => (
              <div className='h-2 my-4 loading rounded' key={index} />
            ))}
          </div>
        </div>
      </Slider>
    </section>
  )
}

export default LoadingAbout
