import { FullyProduct } from '@/app/api/product/[slug]/route'
import Meta from '@/components/Meta'
import Pagination from '@/components/Pagination'
import ProductCard from '@/components/ProductCard'
import { ICategory } from '@/models/CategoryModel'
import { ITag } from '@/models/TagModel'
import { getFlashSalePageApi, getTagsPageApi } from '@/requests'
import { handleQuery } from '@/utils/handleQuery'

async function TagPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  let products: FullyProduct[] = []
  let amount: number = 0
  let chops: { [key: string]: number } | null = null
  let query = ''

  // values
  const itemPerPage = 8

  try {
    // get query
    query = handleQuery(searchParams)

    // cache: no-store for filter
    const data = await getFlashSalePageApi(query)

    // destructure
    products = data.products
    amount = data.amount
    chops = data.chops
  } catch (err: any) {
    console.log(err)
  }

  // jsonLd
  const jsonLd = {
    '@context': 'http://schema.org',
    '@type': 'ItemList',
    name: `Flash Sale`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/category${query}`,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: `${index + 1}`,
      item: {
        '@type': 'Product',
        name: product.title,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/${product.slug}`,
        image: product.images[0],
        description: product.description,
        offers: {
          '@type': 'Offer',
          price: `${product.price}`,
          priceCurrency: 'VND',
          availability: product.stock ? 'InStock' : 'OutOfStock',
        },
      },
    })),
  }

  return (
    <div className='pt-16'>
      {/* Add JSON-LD */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Meta */}
      <Meta title={`Flash Sale`} searchParams={searchParams} type='flash-sale' chops={chops} />

      {/* Amount */}
      <div className='p-3 text-sm text-right text-white font-semibold'>
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} sản phẩm
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

export default TagPage
