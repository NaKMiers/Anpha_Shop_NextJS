import AspectRatio from '@mui/joy/AspectRatio'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Divider from '@mui/joy/Divider'
import Image from 'next/image'
import Link from 'next/link'

function Footer() {
  return (
    <div className='bg-dark-100 text-light max-w-1200 m-auto mb-10 shadow-medium rounded-medium mt-36'>
      <div className='p-21 '>
        <div className='flex items-center justify-between gap-2'>
          <Link href='/' className='flex items-center'>
            <Image src='/images/logo.jpg' width={40} height={40} alt='logo' />
            <span className='text-2xl font-bold'>.AnphaShop</span>
          </Link>

          <div className='flex gap-2'>
            <a href='https://zalo.me/0899320427' target='_blank' rel='noreferrer'>
              <Image src='/images/zalo.jpg' width={32} height={32} alt='zalo' />
            </a>
            <a href='https://www.messenger.com/t/170660996137305' target='_blank' rel='noreferrer'>
              <Image src='/images/messenger.jpg' width={32} height={32} alt='zalo' />
            </a>
            <a href='https://www.instagram.com/anpha.shop' target='_blank' rel='noreferrer'>
              <Image src='/images/instagram.jpg' width={32} height={32} alt='zalo' />
            </a>
          </div>
        </div>

        <Divider sx={{ my: 2 }} />

        <div className='flex flex-col md:flex-row justify-start md:justify-between flex-wrap overflow-hidden'>
          <div className='flex overflow-x-scroll flex-1 no-scrollbar md:mr-5 -mx-1 snap-x relative'>
            {[1, 2, 3, 4, 5, 6].map(item => (
              <div key={item} className='max-w-[235px] shrink-0 px-2 snap-start'>
                <Card variant='soft'>
                  <AspectRatio ratio='16/9'>
                    <Image
                      src='/images/watching-netflix-banner.jpg'
                      width={235}
                      height={(235 * 9) / 16}
                      alt='account'
                    />
                  </AspectRatio>
                  <CardContent>
                    <p className='text-xs'>
                      Netflix Premium (Gói Share 1 Tháng) - Chia Sẻ Niềm Vui Xem Phim Siêu Nét
                    </p>
                    <span className='text-gray-500 font-body text-xs font-semibold'>Netflix</span>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          <ul className='flex justify-between space-x-21 w-full md:w-auto text-gray-300'>
            <div>
              <div className='text-gray-500 text-[12px] font-semibold'>TÀI KHOẢN</div>
              <ul className='tracking-wide text-base'>
                <Link href='/user' className='flex items-center gap-2 text-nowrap'>
                  <svg xmlns='http://www.w3.org/2000/svg' height='13' viewBox='0 0 320 512'>
                    <path
                      className='fill-primary'
                      d='M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z'
                    />
                  </svg>
                  <p className=''>Thông tin tài khoản</p>
                </Link>
                <Link href='/user/recharge' className='flex items-center gap-2 text-nowrap'>
                  <svg xmlns='http://www.w3.org/2000/svg' height='13' viewBox='0 0 320 512'>
                    <path
                      className='fill-primary'
                      d='M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z'
                    />
                  </svg>
                  <p className=''>Nạp tiền</p>
                </Link>
                <Link href='/cart' className='flex items-center gap-2 text-nowrap'>
                  <svg xmlns='http://www.w3.org/2000/svg' height='13' viewBox='0 0 320 512'>
                    <path
                      className='fill-primary'
                      d='M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z'
                    />
                  </svg>
                  <p className=''>Giỏ hàng</p>
                </Link>
                <Link href='/user/order-history' className='flex items-center gap-2 text-nowrap'>
                  <svg xmlns='http://www.w3.org/2000/svg' height='13' viewBox='0 0 320 512'>
                    <path
                      className='fill-primary'
                      d='M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z'
                    />
                  </svg>
                  <p className=''>Lịch sử mua hàng</p>
                </Link>
                <Link href='/user/order-history' className='flex items-center gap-2 text-nowrap'>
                  <svg xmlns='http://www.w3.org/2000/svg' height='13' width='15' viewBox='0 0 448 512'>
                    <path
                      className='fill-yellow-400'
                      d='M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z'
                    />
                  </svg>
                  <p className=''>Logout</p>
                </Link>
              </ul>
            </div>

            <div>
              <div className='text-gray-500 text-[12px] font-semibold'>NỔI BẬT</div>
              <ul>
                <div className='flex items-center gap-1 text-nowrap'>
                  <svg xmlns='http://www.w3.org/2000/svg' height='13' width='20' viewBox='0 0 448 512'>
                    <path
                      className='fill-green-400'
                      d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z'
                    />
                  </svg>
                  <p className=''>Đầy dủ tính năng</p>
                </div>
                <div className='flex items-center gap-1 text-nowrap'>
                  <svg xmlns='http://www.w3.org/2000/svg' height='13' width='20' viewBox='0 0 448 512'>
                    <path
                      className='fill-green-400'
                      d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z'
                    />
                  </svg>
                  <p className=''>Rẻ nhất thị trường</p>
                </div>
                <div className='flex items-center gap-1 text-nowrap'>
                  <svg xmlns='http://www.w3.org/2000/svg' height='13' width='20' viewBox='0 0 448 512'>
                    <path
                      className='fill-green-400'
                      d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z'
                    />
                  </svg>
                  <p className=''>Thanh toán lập tức</p>
                </div>
                <div className='flex items-center gap-1 text-nowrap'>
                  <svg xmlns='http://www.w3.org/2000/svg' height='13' width='20' viewBox='0 0 448 512'>
                    <path
                      className='fill-green-400'
                      d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z'
                    />
                  </svg>
                  <p className=''>Bảo hành uy tín</p>
                </div>
              </ul>
            </div>
          </ul>
        </div>

        <Divider sx={{ my: 2 }} />

        <div className='flex items-center justify-between gap-5 text-center'>
          <p className='text-[14px]'>
            © <span className='text-primary font-semibold'>Anpha.shop</span>. All rights reserved
          </p>
          <p className='text-[14px]'>
            <span className='text-primary font-semibold'>Developed by</span> Nguyen Anh Khoa
          </p>
        </div>
      </div>
    </div>
  )
}

export default Footer
