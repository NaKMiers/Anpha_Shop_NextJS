import About from '@/components/About'
import Banner from '@/components/Banner'
import BestSeller from '@/components/BestSeller'
import ChooseMe from '@/components/ChooseMe'

function Home() {
  return (
    <div className='min-h-screen'>
      <Banner />

      <div className='pt-28' />

      <About />

      <div className='pt-28' />

      <BestSeller />

      <div className='pt-28' />

      <ChooseMe />
    </div>
  )
}

export default Home
