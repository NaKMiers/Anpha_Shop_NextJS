import About from '@/components/About'
import Banner from '@/components/Banner'
import ChooseMe from '@/components/ChooseMe'
import GroupProducts from '@/components/GroupProducts'
import Heading from '@/components/Heading'
import { ICategory } from '@/models/CategoryModel'
import { ITag } from '@/models/TagModel'
import axios from 'axios'
import { FullyProduct } from '../api/product/[slug]/route'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anpha Shop',
  description:
    'Chào mừng bạn đến với Anpha Shop, địa chỉ tin cậy cho những người đang tìm kiếm Account Cao Cấp. Tại Anpha Shop, chúng tôi tự hào mang đến cho bạn những tài khoản chất lượng và đẳng cấp, đáp ứng mọi nhu cầu của bạn. Khám phá bộ sưu tập Account Cao Cấp tại cửa hàng của chúng tôi ngay hôm nay và trải nghiệm sự khác biệt với Anpha Shop - Nơi đáng tin cậy cho sự đẳng cấp!',
}

async function HomePage() {
  let productsByCategoryGroups: any[] = []
  let bestSellerProducts: FullyProduct[] = []
  let flashsaleProducts: FullyProduct[] = []
  let categories: ICategory[] = []
  let tags: ITag[] = []
  let carouselProducts: FullyProduct[] = []

  try {
    const res = await axios.get(`${process.env.APP_URL}/api`)
    const data = res.data

    // For Banner
    tags = data.tags
    categories = data.categories
    carouselProducts = data.carouselProducts

    // For Top #10
    bestSellerProducts = data.bestSellerProducts

    // For Products
    productsByCategoryGroups = data.productsByCategoryGroups
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
      <section className='max-w-1200 mx-auto px-4'>
        <GroupProducts products={bestSellerProducts} hideTop />
      </section>

      <div className='pt-28' />

      <Heading title='Sản phẩm' />
      <section className='max-w-1200 mx-auto px-4'>
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
