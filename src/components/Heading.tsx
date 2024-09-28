import { memo } from 'react'

interface HeadingProps {
  title: string
  className?: string
}

function Heading({ title, className = '' }: HeadingProps) {
  return (
    <h2
      className={`mx-auto my-11 flex w-full max-w-1200 items-center justify-between gap-4 text-center font-sans text-4xl font-light tracking-wide text-white before:h-[1.5px] before:w-full before:bg-white after:h-[1.5px] after:w-full after:bg-white sm:text-nowrap md:text-nowrap ${className}`}
    >
      {title}
    </h2>
  )
}

export default memo(Heading)
