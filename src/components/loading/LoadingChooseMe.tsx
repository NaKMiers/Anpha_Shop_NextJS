import { chooseMeList } from '@/constansts'

function LoadingChooseMe({ className = '' }: { className?: string }) {
  return (
    <div className={`max-w-1200 mx-auto ${className}`}>
      <div className='px-21/2 sm:px-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-between -mx-21'>
        {chooseMeList.map(item => (
          <div
            className='p-21/2 sm:p-21 transition-all duration-300 hover:-translate-y-2'
            key={item.image}>
            <div className='flex flex-col items-center p-21 rounded-small shadow-medium overflow-hidden bg-white'>
              <div className='aspect-square loading rounded-lg w-full mb-2' />

              <h3 className='h-2 my-3 rounded w-[90%] loading' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LoadingChooseMe
