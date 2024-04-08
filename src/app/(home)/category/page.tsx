import { FullyProduct } from '@/app/api/product/[slug]/route'
import Meta from '@/components/Meta'
import Pagination from '@/components/Pagination'
import ProductCard from '@/components/ProductCard'
import { ICategory } from '@/models/CategoryModel'
import { getCategoriesPageApi } from '@/requests'

async function CategoryPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  let categories: ICategory[] = []
  let products: FullyProduct[] = []
  let amount: number = 0
  let chops: { [key: string]: number } | null = null

  // values
  const itemPerPage = 8

  try {
    // cache: no-store for filter
    const data = await getCategoriesPageApi(searchParams)

    // destructure
    products = data.products
    categories = data.categories
    amount = data.amount
    chops = data.chops
  } catch (err: any) {
    console.log(err)
  }

  return (
    <div className='pt-24'>
      <Meta
        title={`Danh Mục - ${categories.map(category => category.title).join(', ')}`}
        searchParams={searchParams}
        type='ctg'
        items={categories}
        chops={chops}
      />

      {/* Amount */}
      <div className='p-3 text-sm text-right text-white font-semibold'>
        {itemPerPage * +(searchParams?.page || 1) > amount
          ? amount
          : itemPerPage * +(searchParams?.page || 1)}
        /{amount} sản phẩm
      </div>

      {/* products */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-21 md:grid-cols-3 lg:grid-cols-4'>
        {products.map(product => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>

      <Pagination
        searchParams={searchParams}
        amount={amount}
        itemsPerPage={itemPerPage}
        className='mt-11'
      />
    </div>
  )
}

export default CategoryPage
