import Image from 'next/image'
import Slider from './Slider'

function About() {
  return (
    <section className='max-w-1200 mx-auto'>
      <Slider className='bg-white bg-opacity-90 rounded-medium shadow-medium'>
        {/* MARK: slide 1 */}
        <div className='flex gap-y-4 flex-wrap h-full p-21'>
          <div className='w-full md:w-2/3 rounded-lg overflow-hidden aspect-video'>
            <Image
              className='w-full h-full object-cover'
              src='/images/netflix-banner.jpg'
              width={1200}
              height={1200}
              alt='banner'
            />
          </div>
          <div className='w-full md:w-1/3 md:pl-21 pb-16 md:pb-0'>
            <p className='font-body text-dark text-[20px] text-center'>
              Sử dụng các phần mềm, ứng dụng bản Crack gián tiếp gây ra rất nhiều vụ lộ dữ liệu nguy hiểm
              trong thời gian gần đây. Mặt khác, trải nghiệm người dùng của bản crack cũng không thể đầy
              đủ được như bản chính hãng. Do đó, Anpha Shop ra đời với mong muốn giúp người Việt tiếp cận
              với các phần mềm, ứng dụng bản quyền với giá rẻ hơn.{' '}
              <span className='text-secondary font-semibold'>20% - 90%</span> giá gốc.
            </p>
          </div>
        </div>

        {/* MARK: slide 2 */}
        <div className='flex gap-y-4 flex-wrap h-full p-21'>
          <div className='w-full md:w-2/3 rounded-lg overflow-hidden aspect-video'>
            <Image
              className='w-full h-full object-cover'
              src='/images/spotify-banner.jpg'
              width={1920}
              height={1080}
              alt='banner'
            />
          </div>
          <div className='w-full md:w-1/3 md:pl-21 pb-16 md:pb-0'>
            <p className='font-body text-dark text-[20px] text-center'>
              <span className='text-primary font-semibold'>Anpha Shop</span> - Đối tác{' '}
              <span className='font-semibold text-green-400'>Spotify</span> chính hãng với giá cực kỳ hấp
              dẫn, giảm đến 90%. Tận hưởng âm nhạc không giới hạn với trải nghiệm an toàn và tiết kiệm.
              Đừng bỏ lỡ cơ hội, mua ngay để thưởng thức những giai điệu tuyệt vời mà không làm suy giảm
              túi tiền của bạn. Hãy chọn Anpha Shop, nơi âm nhạc và ưu đãi hội tụ!
            </p>
          </div>
        </div>

        {/* MARK: slide 3 */}
        <div className='flex gap-y-4 flex-wrap h-full p-21'>
          <div className='w-full md:w-2/3 rounded-lg overflow-hidden aspect-video'>
            <Image
              className='w-full h-full object-cover'
              src='/images/youtube-banner.jpg'
              width={1920}
              height={1080}
              alt='banner'
            />
          </div>
          <div className='w-full md:w-1/3 md:pl-21 pb-16 md:pb-0'>
            <p className='font-body text-dark text-[20px] text-center'>
              Dành cho người yêu thưởng thức nội dung trên{' '}
              <span className='text-red-600 font-semibold'>YouTube</span> . Chúng tôi mang đến ưu đãi
              siêu hấp dẫn với YouTube Premium, giảm giá đến 90%. Trải nghiệm xem video không quảng cáo,
              tải nội dung yêu thích và thưởng thức âm nhạc không giới hạn. Mua ngay để đắm chìm trong
              thế giới giải trí mà không làm giảm túi tiền của bạn!
            </p>
          </div>
        </div>
      </Slider>
    </section>
  )
}

export default About
