import { FullyProduct } from '@/app/api/product/[slug]/route'
import Meta from '@/components/Meta'
import ProductCard from '@/components/ProductCard'
import { ITag } from '@/models/TagModel'
import { getTagsPageApi } from '@/requests'

async function TagPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  let tags: ITag[] = []
  let products: FullyProduct[] = []

  try {
    // send request to get products
    console.log('searchParams: ', searchParams)

    // revalidate every 1 minute
    const data = await getTagsPageApi(searchParams)

    products = data.products
    tags = data.tags
  } catch (err: any) {
    console.log(err)
  }

  return (
    <div className='pt-24'>
      <Meta title={`Tag - ${tags.map(tag => tag.title).join(' - ')}`} />
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

export default TagPage
