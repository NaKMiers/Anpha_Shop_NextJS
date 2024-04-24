import Image from 'next/image'

interface CategoryRankTabProps {
  categories: any[]
  className?: string
}

function CategoryRankTab({ categories, className = '' }: CategoryRankTabProps) {
  console.log('categories: ', categories)

  return (
    <div className={`${className}`}>
      {categories.map((category, index) => (
        <div
          className={`flex items-center justify-between gap-3 px-3 py-1 mb-4 rounded-xl shadow-md`}
          style={{
            width: `calc(100% - ${index * 6 < 40 ? index * 6 : 40}%)`,
            background: category.color,
          }}
          key={category._id}>
          <div className='flex items-center gap-2'>
            <div className='p-[2px] bg-white rounded-md'>
              {' '}
              <Image src={category.logo} width={20} height={20} alt='logo' />
            </div>
            <span className='font-body tracking-wider text-white bg-dark-100 px-2 rounded-full'>
              {category.title}
            </span>
          </div>
          <span className='flex justify-center items-center font-semibold text-xs h-5 px-2 rounded-full bg-dark-100 text-white'>
            {category.sold}
          </span>
        </div>
      ))}
    </div>
  )
}

export default CategoryRankTab
