import { FullyProduct } from '@/app/api/product/[slug]/route'
import Meta from '@/components/Meta'
import ProductCard from '@/components/ProductCard'
import axios from 'axios'

async function FlashSalePage() {
  let products: FullyProduct[] = []

  try {
    // send request to get products
    const res = await axios.get(`${process.env.APP_URL}/api/flash-sale`)

    products = res.data.products
  } catch (err: any) {
    console.log(err)
  }

  return (
    <div className='pt-24'>
      <Meta title={`Hiện Đang Giảm Giá`} />
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

export default FlashSalePage
