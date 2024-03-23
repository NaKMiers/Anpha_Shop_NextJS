import About from '@/components/About'
import Banner from '@/components/Banner'
import ChooseMe from '@/components/ChooseMe'
import GroupProducts from '@/components/GroupProducts'
import Heading from '@/components/Heading'

async function HomePage() {
  return (
    <div className='min-h-screen'>
      <Banner />

      <div className='pt-28' />

      <Heading title='Về Anpha Shop' />
      <About />

      <div className='pt-28' />

      <Heading title='Top #10' />
      <section className='max-w-1200 mx-auto'>
        <GroupProducts />
      </section>

      <div className='pt-28' />

      <Heading title='Sản phẩm' />
      <section className='max-w-1200 mx-auto'>
        <GroupProducts />
        <div className='pt-20' />
        <GroupProducts />
        <div className='pt-20' />
        <GroupProducts />
        <div className='pt-20' />
        <GroupProducts />
      </section>

      <div className='pt-28' />

      <Heading title='Tại sao chọn tôi' />
      <ChooseMe />
    </div>
  )
}

export default HomePage
