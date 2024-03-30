import { FullyProduct } from '@/app/api/product/[slug]/route'
import Meta from '@/components/Meta'
import ProductCard from '@/components/ProductCard'
import { ICategory } from '@/models/CategoryModel'
import axios from 'axios'

async function CategoryPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  let categories: ICategory[] = []
  let products: FullyProduct[] = []

  try {
    // send request to get products
    console.log('searchParams: ', searchParams)

    let url = `${process.env.APP_URL}/api/category?`
    for (let key in searchParams) {
      // check if key is an array
      if (Array.isArray(searchParams[key])) {
        for (let value of searchParams[key]) {
          url += `${key}=${value}&`
        }
      } else {
        url += `${key}=${searchParams[key]}&`
      }
    }

    // remove final '&'
    url = url.slice(0, -1)
    console.log('url:', url)

    const res = await axios.get(url)
    console.log(res.data)

    products = res.data.products
    categories = res.data.categories
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
