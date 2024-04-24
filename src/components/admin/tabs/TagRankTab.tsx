interface TagRankTabProps {
  tags: any[]
  className?: string
}

function TagRankTab({ tags, className = '' }: TagRankTabProps) {
  return (
    <div className={`${className}`}>
      {tags.map((tag, index) => (
        <div
          className={`flex items-center justify-between gap-3 px-3 py-1 mb-4 bg-white shadow-lg rounded-xl `}
          style={{ width: `calc(100% - ${index * 6 < 40 ? index * 6 : 40}%)` }}
          key={index}>
          <span className='font-body tracking-wider text-dark'>{tag.title}</span>
          <span className='flex justify-center items-center font-semibold text-xs h-5 px-2 rounded-full bg-dark-100 text-white'>
            {tag.sold}
          </span>
        </div>
      ))}
    </div>
  )
}

export default TagRankTab
