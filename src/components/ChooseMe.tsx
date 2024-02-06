import Image from 'next/image'
import Heading from './Heading'

function ChooseMe() {
  return (
    <div className='max-w-1200 m-auto'>
      <Heading title='Tại sao chọn tôi' />

      <div className='flex flex-wrap justify-between -mx-21'>
        <div className='p-21 w-1/2 md:w-1/3 lg:w-1/4'>
          <div className='rounded-small shadow-medium overflow-hidden bg-white'>
            <div className='aspect-square p-3'>
              <Image src='/images/choose-me-1.jpg' width={300} height={300} alt='Đa dạng sản phẩm' />
            </div>

            <h3 className='font-body text-[22px] text-darker px-21 pb-21 font-semibold text-center'>
              Đa dạng sản phẩm
            </h3>
          </div>
        </div>

        <div className='p-21 w-1/2 md:w-1/3 lg:w-1/4'>
          <div className='rounded-small shadow-medium overflow-hidden bg-white'>
            <div className='aspect-square p-3'>
              <Image src='/images/choose-me-2.jpg' width={300} height={300} alt='Rẻ nhất thị trường' />
            </div>

            <h3 className='font-body text-[22px] text-darker px-21 pb-21 font-semibold text-center'>
              Rẻ nhất thị trường
            </h3>
          </div>
        </div>

        <div className='p-21 w-1/2 md:w-1/3 lg:w-1/4'>
          <div className='rounded-small shadow-medium overflow-hidden bg-white'>
            <div className='aspect-square p-3'>
              <Image
                src='/images/choose-me-3.jpg'
                className='object-cover'
                width={300}
                height={300}
                alt='Thanh toán lập tức'
              />
            </div>

            <h3 className='font-body text-[22px] text-darker px-21 pb-21 font-semibold text-center'>
              Thanh toán lập tức
            </h3>
          </div>
        </div>

        <div className='p-21 w-1/2 md:w-1/3 lg:w-1/4'>
          <div className='rounded-small shadow-medium overflow-hidden bg-white'>
            <div className='aspect-square p-3'>
              <Image src='/images/choose-me-4.jpg' width={300} height={300} alt='Bảo hành uy tín' />
            </div>

            <h3 className='font-body text-[22px] text-darker px-21 pb-21 font-semibold text-center'>
              Bảo hành uy tín
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChooseMe
