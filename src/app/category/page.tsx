'use client'

import Meta from '@/components/Meta'
import ProductCard from '@/components/ProductCard'

function CategoryPage() {
  return (
    <div className='max-w-1200 mx-auto pt-24'>
      <Meta />
      <div className='pt-11' />

      {/* products */}
      <div className='grid grid-cols-1 gap-21 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </div>
  )
}

export default CategoryPage
