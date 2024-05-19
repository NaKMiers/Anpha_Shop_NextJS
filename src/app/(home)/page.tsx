import About from '@/components/About'
import Banner from '@/components/Banner'
import ChooseMe from '@/components/ChooseMe'
import Divider from '@/components/Divider'
import GroupProducts from '@/components/GroupProducts'
import Heading from '@/components/Heading'
import { ICategory } from '@/models/CategoryModel'
import { ITag } from '@/models/TagModel'
import { getHomeApi } from '@/requests'
import { Metadata } from 'next'
import { FullyProduct } from '../api/product/[slug]/route'
import RandomBox from '@/components/RandomBox'

export const metadata: Metadata = {
  title: 'Anpha Shop',
  description:
    'Chào mừng bạn đến với Anpha Shop, địa chỉ tin cậy cho những người đang tìm kiếm Account Cao Cấp. Tại Anpha Shop, chúng tôi tự hào mang đến cho bạn những tài khoản chất lượng và đẳng cấp, đáp ứng mọi nhu cầu của bạn. Khám phá bộ sưu tập Account Cao Cấp tại cửa hàng của chúng tôi ngay hôm nay và trải nghiệm sự khác biệt với Anpha Shop - Nơi đáng tin cậy cho sự đẳng cấp!',
}

async function HomePage() {
  // Data
  let productsByCategoryGroups: any[] = []
  let bestSellerProducts: FullyProduct[] = []
  let categories: ICategory[] = []
  let tags: ITag[] = []
  let carouselProducts: FullyProduct[] = []

  // MARK: Get Data
  try {
    // revalidate every 1 minute
    const data = await getHomeApi()

    // for Banner
    tags = data.tags
    categories = data.categories
    carouselProducts = data.carouselProducts

    // for top #10
    bestSellerProducts = data.bestSellerProducts

    // for products
    productsByCategoryGroups = data.productsByCategoryGroups
  } catch (err: any) {
    console.log(err)
  }

  // jsonLD
  const jsonLd = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    name: 'Anpha Shop',
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.jpg`,
    url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    inLanguage: 'vi',
    description:
      'Anpha Shop - Shop tài khoản uy tín, chất lượng hàng đầu tại Việt Nam. Đặc biệt, Account tại Anpha Shop hiện là đang là gói account có giá cạnh nhất hàng đầu - chỉ là 9.000VND/tháng',
    publisher: {
      '@type': 'Organization',
      name: 'Anpha Shop',
    },
  }

  return (
    <div className='min-h-screen'>
      {/* MARK: Add JSON-LD */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* MARK: Banner */}
      <Banner carouselProducts={carouselProducts} tags={tags} categories={categories} />

      <Divider size={28} />

      {/* MARK: Top #10 */}
      <h2 className='max-w-1200 mx-auto text-nowrap flex items-center gap-4 my-11 w-full justify-between text-white font-sans text-4xl tracking-wide font-light before:h-[1.5px] before:w-full before:bg-white after:h-[1.5px] after:w-full text-center after:bg-white sm:text-nowrap'>
        Top <span className='font-semibold text-5xl italic text-orange-500 box-'>#10</span>
      </h2>

      <section className='max-w-1200 mx-auto px-4'>
        <GroupProducts products={bestSellerProducts} bestSeller />
      </section>

      <Divider size={28} />

      {/* MARK: Products */}
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

      <Divider size={28} />

      {/* MARK: About */}
      <Heading title='Về Anpha Shop' />
      <About />

      <Divider size={28} />

      {/* MARK: Choose Me */}
      <Heading title='Tại sao chọn tôi' />
      <ChooseMe />
    </div>
  )
}

export default HomePage
