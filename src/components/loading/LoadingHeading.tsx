function LoadingHeading({ size = 350, className = '' }: { size?: number; className?: string }) {
  return (
    <h2
      className={`max-w-1200 mx-auto flex items-center gap-4 my-11 w-full justify-between before:h-[1.5px] before:w-full before:bg-white after:h-[1.5px] after:w-full after:bg-white${className}`}>
      <span
        className='flex-shrink-0 h-2.5 loading rounded border-2 max-w-[90%]'
        style={{ width: size }}
      />
    </h2>
  )
}

export default LoadingHeading
