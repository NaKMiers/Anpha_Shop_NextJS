import { chooseMeList } from '@/constansts'
import Image from 'next/image'

interface ChooseMeProps {
  className?: string
}

function ChooseMe({ className = '' }: ChooseMeProps) {
  return (
    <div className={`max-w-1200 mx-auto ${className}`}>
      <div className='px-21/2 sm:px-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-between -mx-21'>
        {chooseMeList.map(item => (
          <div
            className='p-21/2 sm:p-21 transition-all duration-300 hover:-translate-y-2'
            key={item.image}>
            <div className='flex flex-col items-center rounded-small shadow-medium overflow-hidden bg-white'>
              <div className='aspect-square p-3'>
                <Image src={item.image} width={250} height={250} alt={item.title} />
              </div>

              <h3 className='font-body text-[22px] text-darker px-21 pb-21 font-semibold text-center'>
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChooseMe
