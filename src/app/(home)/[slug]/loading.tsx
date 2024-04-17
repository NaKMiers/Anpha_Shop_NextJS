import Divider from '@/components/Divider'
import Slider from '@/components/Slider'
import LoadingBuyActionWithQuantity from '@/components/loading/LoadingBuyActionWithQuantity'
import LoadingChooseMe from '@/components/loading/LoadingChooseMe'
import LoadingComment from '@/components/loading/LoadingComment'
import LoadingGroupProducts from '@/components/loading/LoadingGroupProducts'
import LoadingLinkBar from '@/components/loading/LoadingLinkBar'
import LoadingPrice from '@/components/loading/LoadingPrice'
import { FaCircleCheck, FaTags } from 'react-icons/fa6'
import { MdCategory } from 'react-icons/md'
import { TbPackages } from 'react-icons/tb'

async function LoadingProductPage() {
  return (
    <div className='pt-9'>
      {/* MARK: Top */}
      <section className='bg-white p-8 flex flex-col gap-x-21 gap-y-21/2 md:flex-row rounded-medium shadow-medium'>
        <div className='w-full md:w-[45%] md:max-w-[500px]'>
          <div className='relative aspect-video shadow-xl rounded-md'>
            <Slider>
              <div className='w-full h-full loading rounded-lg' />
            </Slider>
          </div>

          {/* Link */}
          <LoadingLinkBar className='mt-21' />
        </div>

        <div className='md:w-[55%]'>
          <div className='h-2 w-full mt-3 mb-5 rounded loading' />
          <div className='h-2 w-full mt-3 mb-5 rounded loading' />

          <LoadingPrice big />

          <div className='flex flex-col gap-3 text-xl font-body tracking-wide mt-5'>
            {/* Category */}
            <div className='flex items-center flex-wrap gap-1'>
              <MdCategory className='w-7 text-darker' size={26} />
              <span className='rounded loading h-2 w-[80px] mr-2' />
              <span className='rounded loading h-2 w-[25px] mr-2' />
            </div>

            {/* Tags */}
            <div className='flex items-center gap-1 flex-wrap'>
              <FaTags className='w-7 text-darker' size={20} />
              <span className='rounded loading h-2 w-[80px] mr-2' />
              {Array.from({ length: 2 }).map((_, index) => (
                <span className='rounded loading h-2 w-[54px] mr-2' key={index} />
              ))}
            </div>
            <div className='flex items-center gap-1'>
              <TbPackages className='w-7 text-darker' size={26} />
              <span className='rounded loading h-2 w-[80px] mr-2' />
              <span className='rounded loading h-2 w-[25px] mr-2' />
            </div>
            <div className='flex items-center gap-1'>
              <FaCircleCheck className='w-7 text-darker' size={20} />
              <span className='rounded loading h-2 w-[80px] mr-2' />
              <span className='rounded loading h-2 w-[25px] mr-2' />
            </div>
          </div>

          <LoadingBuyActionWithQuantity />
        </div>
      </section>

      <Divider size={9} />

      {/* MARK: Related Products */}
      <section className='max-w-1200 mx-auto bg-dark-100 border-4 border-white p-8 rounded-medium shadow-medium overflow-hidden'>
        <LoadingGroupProducts hideTop />
      </section>

      <Divider size={9} />

      {/* MARK: Detail */}
      <section className='max-w-1200 mx-auto bg-white p-8 rounded-medium shadow-medium'>
        {/* MARK: Introduction */}
        <div className='h-2 w-full max-w-[300px] mt-3 mb-5 rounded loading' />

        <div className='flex flex-wrap w-full -mx-21/2'>
          <div className='w-full px-21/2 mb-12'>
            <div className='h-2 w-[90%] my-3 mb-2 rounded loading' />
            <div className='h-2 w-[90%] my-3 mb-2 rounded loading' />
            <div className='h-2 w-[90%] my-3 mb-2 rounded loading' />
          </div>

          <div className='inline-block w-full md:w-1/2 px-21/2 mb-12'>
            <div className='h-2 w-full max-w-[300px] mt-3 mb-5 rounded loading' />

            <div className='h-2 w-[90%] m-3 mb-4 rounded loading' />
            <div className='h-2 w-[90%] m-3 mb-4 rounded loading' />
            <div className='h-2 w-[90%] m-3 mb-4 rounded loading' />
            <div className='h-2 w-[90%] m-3 mb-4 rounded loading' />
          </div>

          <div className='inline-block w-full md:w-1/2 px-21/2 mb-12'>
            <div className='h-2 w-full max-w-[300px] mt-3 mb-5 rounded loading' />

            <div className='h-2 w-[90%] m-3 mb-4 rounded loading' />
            <div className='h-2 w-[90%] m-3 mb-4 rounded loading' />
            <div className='h-2 w-[90%] m-3 mb-4 rounded loading' />
            <div className='h-2 w-[90%] m-3 mb-4 rounded loading' />
          </div>

          <div className='inline-block w-full md:w-1/2 px-21/2 mb-12'>
            <div className='h-2 w-full max-w-[300px] mt-3 mb-5 rounded loading' />

            <div className='h-2 w-[90%] m-3 mb-4 rounded loading' />
            <div className='h-2 w-[90%] m-3 mb-4 rounded loading' />
            <div className='h-2 w-[90%] m-3 mb-4 rounded loading' />
            <div className='h-2 w-[90%] m-3 mb-4 rounded loading' />
          </div>

          <div className='inline-block w-full md:w-1/2 px-21/2 mb-12'>
            <div className='h-2 w-full max-w-[300px] mt-3 mb-5 rounded loading' />

            <div className='h-2 w-[90%] m-3 mb-4 rounded loading' />
            <div className='h-2 w-[90%] m-3 mb-4 rounded loading' />
            <div className='h-2 w-[90%] m-3 mb-4 rounded loading' />
            <div className='h-2 w-[90%] m-3 mb-4 rounded loading' />
          </div>
        </div>

        {/* MARK: Choose Me */}
        <div className='mb-10'>
          <div className='h-2 w-full max-w-[300px] mt-3 mb-5 rounded loading' />
          <LoadingChooseMe className='mx-[-16px]' />
        </div>
      </section>

      <Divider size={9} />

      {/* MARK: Comment */}
      <section className='max-w-1200 mx-auto bg-white p-21 rounded-medium shadow-medium'>
        <h3 className='text-[24px] font-semibold text-dark'>Bình luận gần đây</h3>
        <LoadingComment className='mt-4' />
      </section>
    </div>
  )
}

export default LoadingProductPage
