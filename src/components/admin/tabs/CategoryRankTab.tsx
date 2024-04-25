import { FullyProduct } from '@/app/api/product/[slug]/route'
import { ICategory } from '@/models/CategoryModel'
import { getAllProductsApi } from '@/requests'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCircleNotch } from 'react-icons/fa'

interface CategoryRankTabProps {
  className?: string
}

function CategoryRankTab({ className = '' }: CategoryRankTabProps) {
  // states
  const [loading, setLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const getProducts = async () => {
      // start loading
      setLoading(true)

      try {
        const query = '?limit=no-limit&sort=createdAt|-1'
        const { products } = await getAllProductsApi(query)

        // Category Sold Rank
        const categorySoldMap: { [key: string]: ICategory & { sold: number } } = {}
        products.forEach((product: FullyProduct) => {
          const { category, sold }: { category: ICategory; sold: number } = product
          if (!categorySoldMap[category.slug]) {
            categorySoldMap[category.slug] = { ...category, sold: 0 }
          }
          categorySoldMap[category.slug].sold = (categorySoldMap[category.slug].sold || 0) + sold
        })
        const rankCategories = Object.entries(categorySoldMap)
          .map(([_, category]) => category)
          .sort((a, b) => b.sold - a.sold)

        setCategories(rankCategories)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setLoading(false)
      }
    }
    getProducts()
  }, [])

  return (
    <div className={`${className}`}>
      {!loading ? (
        categories.map((category, index) => (
          <div
            className={`flex items-center justify-between gap-2 px-3 py-1 mb-4 rounded-xl shadow-md overflow-x-auto no-scrollbar`}
            style={{
              width: `calc(100% - ${index * 6 < 40 ? index * 6 : 40}%)`,
              background: category.color,
            }}
            key={category._id}>
            <div className='flex-shrink-0 flex items-center gap-2'>
              <div className='flex-shrink-0 p-[2px] bg-white rounded-md'>
                <Image src={category.logo} width={20} height={20} alt='logo' />
              </div>
              <span className='font-body text-sm font-semibold tracking-wider text-white bg-dark-100 px-2 rounded-full'>
                {category.title}
              </span>
            </div>
            <span className='flex justify-center items-center font-semibold text-xs h-5 px-2 rounded-full bg-dark-100 text-white'>
              {category.sold}
            </span>
          </div>
        ))
      ) : (
        <div className='flex items-center justify-center'>
          <FaCircleNotch size={18} className='animate-spin text-slate-400' />
        </div>
      )}
    </div>
  )
}

export default CategoryRankTab
