import ChooseMe from '@/components/ChooseMe'
import Divider from '@/components/Divider'
import Heading from '@/components/Heading'
import LoadingAbout from '@/components/loading/LoadingAbout'
import LoadingBanner from '@/components/loading/LoadingBanner'
import LoadingGroupProducts from '@/components/loading/LoadingGroupProducts'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anpha Shop',
  description:
    'Chào mừng bạn đến với Anpha Shop, địa chỉ tin cậy cho những người đang tìm kiếm Account Cao Cấp. Tại Anpha Shop, chúng tôi tự hào mang đến cho bạn những tài khoản chất lượng và đẳng cấp, đáp ứng mọi nhu cầu của bạn. Khám phá bộ sưu tập Account Cao Cấp tại cửa hàng của chúng tôi ngay hôm nay và trải nghiệm sự khác biệt với Anpha Shop - Nơi đáng tin cậy cho sự đẳng cấp!',
}

async function LoadingHomePage() {
  return (
    <div className='min-h-screen'>
      {/* MARK: Banner */}
      <LoadingBanner />

      <Divider size={28} />

      {/* MARK: About */}
      <Heading title='Về Anpha Shop' />
      {/* <About /> */}
      <LoadingAbout />

      <Divider size={28} />

      {/* MARK: Top #10 */}
      <h2 className='max-w-1200 mx-auto text-nowrap flex items-center gap-4 my-11 w-full justify-between text-light font-sans text-4xl tracking-wide font-light before:h-[1.5px] before:w-full before:bg-white after:h-[1.5px] after:w-full text-center after:bg-white sm:text-nowrap'>
        Top <span className='font-semibold text-5xl italic text-orange-500 box-'>#10</span>
      </h2>
      <section className='max-w-1200 mx-auto px-4'>
        <LoadingGroupProducts />
      </section>

      <Divider size={28} />

      {/* MARK: Products */}
      <Heading title='Sản phẩm' />
      <section className='max-w-1200 mx-auto px-4'>
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingGroupProducts className={index !== 6 - 1 ? 'mb-20' : ''} key={index} />
        ))}
      </section>

      <Divider size={28} />

      {/* MARK: Choose Me */}
      <Heading title='Tại sao chọn tôi' />
      <ChooseMe />
    </div>
  )
}

export default LoadingHomePage
