import { chooseMeList } from '@/constants'
import Image from 'next/image'
import { memo } from 'react'

interface ChooseMeProps {
  className?: string
}

function ChooseMe({ className = '' }: ChooseMeProps) {
  return (
    <div className={`mx-auto max-w-1200 ${className}`}>
      <div className="grid grid-cols-2 justify-between gap-21/2 md:grid-cols-4 md:gap-21">
        {chooseMeList.map(item => (
          <div
            className="transition-all duration-300 hover:-translate-y-2"
            key={item.image}
          >
            <div className="flex h-full flex-col items-center overflow-hidden rounded-small bg-white shadow-medium">
              <div className="aspect-square p-3">
                <Image
                  src={item.image}
                  width={250}
                  height={250}
                  alt={item.title}
                />
              </div>

              <h3 className="px-21 pb-21 text-center font-body text-base font-semibold text-darker">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(ChooseMe)
