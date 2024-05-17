'use client'

import LoadingButton from './LoadingButton'
import Slider3D from './Slider3D'

function RandomBox() {
  return (
    <div className='rounded-medium shadow-medium bg-white p-21'>
      {/* 3D Slider */}
      <Slider3D />

      {/* Action Buttons */}
      <div className='flex justify-center'>
        <LoadingButton
          className='px-4 py-2 bg-secondary hover:bg-primary text-white rounded-lg font-semibold common-transition'
          onClick={() => {}}
          text='Quay'
          isLoading={false}
        />
      </div>
    </div>
  )
}

export default RandomBox
