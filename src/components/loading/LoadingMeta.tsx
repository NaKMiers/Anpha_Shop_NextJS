'use client'

import { FaSearch, FaSort } from 'react-icons/fa'
import LoadingInput from './LoadingInput'

interface LoadingMetaProps {
  items?: boolean
  className?: string
}

function LoadingMeta({ items, className = '' }: LoadingMetaProps) {
  return (
    <div
      className={`bg-white self-end w-full rounded-medium shadow-md text-dark overflow-auto transition-all duration-300 no-scrollbar p-21 ${className}`}>
      {/* MARK: Title */}
      <div className='h-2 w-full max-w-[300px] loading rounded mt-3 mb-7' />

      {/* MARK: Filter */}
      <div className='grid grid-cols-12 gap-21'>
        {/* Search */}
        <div className='flex flex-col col-span-12 md:col-span-4'>
          <LoadingInput className='md:max-w-[450px]' type='text' icon={FaSearch} />
        </div>

        {/* Price */}
        <div className='flex flex-col col-span-12 md:col-span-4'>
          <div className='flex gap-2'>
            <div className='h-2 w-[40px] my-[7px] loading rounded' />
            <div className='h-2 w-[70px] my-[7px] loading rounded' />
            <div className='h-2 w-[70px] my-[7px] loading rounded' />
          </div>
          <div className='relative h-2 w-full loading rounded my-2'>
            <div className='w-4 h-4 rounded-full bg-loading absolute top-1/2 right-0 -translate-y-1/2' />
          </div>
        </div>

        {/* Stock */}
        <div className='flex flex-col col-span-12 md:col-span-4'>
          <div className='flex gap-2'>
            <div className='h-2 w-[40px] my-[7px] loading rounded' />
            <div className='h-2 w-[70px] my-[7px] loading rounded' />
            <div className='h-2 w-[70px] my-[7px] loading rounded' />
          </div>
          <div className='relative h-2 w-full loading rounded my-2'>
            <div className='w-4 h-4 rounded-full bg-loading absolute top-1/2 right-0 -translate-y-1/2' />
          </div>
        </div>

        {/* MARK: Item Selection */}
        {items && (
          <div className='flex justify-end items-end gap-1 flex-wrap max-h-[228px] md:max-h-[152px] lg:max-h-[152px] col-span-12'>
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                className={` h-[34px] w-[40px] max-w-60 rounded-md loading`}
                title='All Types'
                key={index}
              />
            ))}
          </div>
        )}

        {/* MARK: Select Filter */}
        <div className='flex justify-end items-center flex-wrap gap-3 col-span-12 md:col-span-8'>
          {/* Sort */}
          <LoadingInput icon={FaSort} type='select' />
        </div>

        {/* MARK: Filter Buttons */}
        <div className='flex justify-end gap-2 items-center col-span-12 md:col-span-4'>
          <button className='w-[85px] h-[40px] loading rounded-md' />
          <button className='w-[96px] h-[40px] loading rounded-md' />
        </div>
      </div>
    </div>
  )
}

export default LoadingMeta
