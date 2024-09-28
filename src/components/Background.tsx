import { memo } from 'react'

function Background({ noBeta }: { noBeta?: boolean }) {
  return (
    <>
      <div className="background-app fixed left-0 top-0 -z-10 h-screen w-screen" />

      {!noBeta && (
        <div className="fixed left-0 top-0 -z-10 flex h-screen w-screen items-center justify-center text-9xl font-semibold md:text-[175px] lg:text-[256px]">
          {/* <p className='text-primary drop-shadow-lg'>Beta</p> */}
        </div>
      )}
    </>
  )
}

export default memo(Background)
