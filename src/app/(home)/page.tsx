import About from '@/components/About'
import Banner from '@/components/Banner'
import ChooseMe from '@/components/ChooseMe'
import GroupProducts from '@/components/GroupProducts'
import Heading from '@/components/Heading'
import { ICategory } from '@/models/CategoryModel'
import { ITag } from '@/models/TagModel'
import axios from 'axios'
import { FullyProduct } from '../api/product/[slug]/route'

async function HomePage() {
  let productsByCategoryGroups: any[] = []
  let bestSellerProducts: FullyProduct[] = []
  let flashsaleProducts: FullyProduct[] = []
  let categories: ICategory[] = []
  let tags: ITag[] = []
  let carouselProducts: FullyProduct[] = []

  try {
    const res = await axios.get(`${process.env.APP_URL}/api`)

    // For Banner
    tags = res.data.tags
    categories = res.data.categories
    carouselProducts = res.data.carouselProducts

    // For Top #10
    bestSellerProducts = res.data.bestSellerProducts

    // For Products
    productsByCategoryGroups = res.data.productsByCategoryGroups
  } catch (err: any) {
    console.log(err.response.data)
  }

  return (
    <div className='min-h-screen'>
      <Banner carouselProducts={carouselProducts} tags={tags} categories={categories} />

      <div className='pt-28' />

      <Heading title='Về Anpha Shop' />
      <About />

      <div className='pt-28' />

      <Heading title='Top #10' />
      <section className='max-w-1200 mx-auto'>
        <GroupProducts products={bestSellerProducts} hideTop />
      </section>

      <div className='pt-28' />

      <Heading title='Sản phẩm' />
      <section className='max-w-1200 mx-auto'>
        {productsByCategoryGroups.map((group, index) => (
          <GroupProducts
            category={group.category}
            className={index !== productsByCategoryGroups.length - 1 ? 'mb-20' : ''}
            products={group.products}
            key={group.category._id}
          />
        ))}
      </section>

      <div className='pt-28' />

      <Heading title='Tại sao chọn tôi' />
      <ChooseMe />
    </div>
  )
}

export default HomePage
