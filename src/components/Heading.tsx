interface HeadingProps {
  title: string
  className?: string
}

function Heading({ title, className = '' }: HeadingProps) {
  return (
    <h2
      className={`max-w-1200 mx-auto flex items-center gap-4 my-11 w-full justify-between text-light font-sans text-4xl tracking-wide font-light before:h-[1.5px] before:w-full before:bg-white after:h-[1.5px] after:w-full text-center after:bg-white sm:text-nowrap ${className}`}>
      {title}
    </h2>
  )
}

export default Heading
