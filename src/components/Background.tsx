function Background({ noBeta }: { noBeta?: boolean }) {
  return (
    <>
      <div className='background-app fixed w-screen h-screen top-0 left-0 -z-10' />

      {!noBeta && (
        <div className='flex items-center justify-center text-9xl md:text-[175px] lg:text-[256px] font-semibold fixed w-screen h-screen top-0 left-0 -z-10'>
          {/* <p className='text-primary drop-shadow-lg'>Beta</p> */}
        </div>
      )}
    </>
  )
}

export default Background
