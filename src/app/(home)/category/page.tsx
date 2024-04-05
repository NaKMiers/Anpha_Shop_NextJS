import { FullyProduct } from '@/app/api/product/[slug]/route'
import Meta from '@/components/Meta'
import ProductCard from '@/components/ProductCard'
import { ICategory } from '@/models/CategoryModel'
import { getCategoriesPageApi } from '@/requests'

async function CategoryPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  let categories: ICategory[] = []
  let products: FullyProduct[] = []

  try {
    // send request to get products
    console.log('searchParams: ', searchParams)

    const data = await getCategoriesPageApi(searchParams)

    products = data.products
    categories = data.categories
  } catch (err: any) {
    console.log(err)
  }

  return (
    <div className='pt-24'>
      <Meta title={`Danh Mục - ${categories.map(category => category.title).join(' - ')}`} />
      <div className='pt-11' />

      {/* products */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-21 md:grid-cols-3 lg:grid-cols-4'>
        {products.map(product => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
    </div>
  )
}

export default CategoryPage
