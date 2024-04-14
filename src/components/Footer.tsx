'use client'
import { ProductWithTagsAndCategory } from '@/app/(admin)/admin/product/all/page'
import { getBestSellerProductsApi } from '@/requests'
import AspectRatio from '@mui/joy/AspectRatio'
import Card from '@mui/joy/Card'
import CardContent from '@mui/joy/CardContent'
import Divider from '@mui/joy/Divider'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { FaCheck, FaChevronRight } from 'react-icons/fa6'
import { PiSignOutBold } from 'react-icons/pi'

function Footer() {
  // states
  const [bestSellerProducts, setBestSellerProducts] = useState<ProductWithTagsAndCategory[]>([])

  // get best seller products
  useEffect(() => {
    const getBestSellerProducts = async () => {
      try {
        // send request to server to get best seller products
        const { products } = await getBestSellerProductsApi() // revalidate every 1 hour

        // set best seller products to state
        setBestSellerProducts(products)
      } catch (err: any) {
        console.log(err)
      }
    }
    getBestSellerProducts()
  }, [])

  return (
    <div className='mb-10 mt-36 px-21'>
      <div className='max-w-1200 mx-auto bg-dark-100 text-light shadow-medium rounded-medium'>
        <div className='p-21'>
          {/* Top */}
          <div className='flex flex-col px-4 -mx-4 sm:flex-row items-center justify-between gap-3 group'>
            <Link href='/' className='flex items-center'>
              <div className='rounded-full spin'>
                <Image
                  className='aspect-square rounded-full'
                  src='/images/logo.jpg'
                  width={40}
                  height={40}
                  alt='logo'
                />
              </div>
              <span className='text-2xl font-bold group-hover:tracking-wide transition-all duration-300'>
                .AnphaShop
              </span>
            </Link>

            {/* Social Contacts */}
            <div className='flex gap-5 sm:gap-3'>
              <a href='https://zalo.me/0899320427' target='_blank' rel='noreferrer' className='wiggle-1'>
                <Image src='/images/zalo.jpg' width={30} height={30} alt='zalo' />
              </a>
              <a
                href='https://www.messenger.com/t/170660996137305'
                target='_blank'
                rel='noreferrer'
                className='wiggle-1'>
                <Image src='/images/messenger.jpg' width={30} height={30} alt='messenger' />
              </a>
              <a
                href='mailto:anpha.pohs@gmail.com'
                target='_blank'
                rel='noreferrer'
                className='wiggle-1'>
                <Image src='/images/gmail.jpg' width={30} height={30} alt='gmail' />
              </a>
            </div>
          </div>

          <Divider sx={{ my: 2 }} />

          {/* Center */}
          <div className='flex flex-col md:flex-row justify-start md:justify-between flex-wrap overflow-hidden'>
            {/* Slider */}
            <div className='flex w-full overflow-x-scroll flex-1 md:mr-5 -mx-1 relative select-none cursor-pointer snap-mandatory no-scrollbar md:show-scrollbar'>
              {bestSellerProducts.map((product, index) => (
                <Link
                  href={`/${product.slug}`}
                  className='block w-[230px] shrink-0 px-2 group snap-start group'
                  key={index}>
                  <Card className='text-dark' variant='soft'>
                    <AspectRatio ratio='16/9'>
                      <Image
                        className='group-hover:scale-105 duration-500 transition ease-in-out'
                        src={product.images[0]}
                        width={235}
                        height={(235 * 9) / 16}
                        alt='account'
                      />
                    </AspectRatio>
                    <CardContent>
                      <p className='text-xs' title={product.title}>
                        {product.title}
                      </p>
                      <span className='text-gray-500 font-body text-xs font-semibold'>
                        {product.category.title}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Links & Features*/}
            <ul className='flex flex-col md:flex-row gap-21 w-full md:w-auto justify-between mt-21 md:mt-0 text-gray-300'>
              <div>
                <div className='text-gray-500 text-[12px] font-semibold'>TÀI KHOẢN</div>
                <ul className='tracking-wide text-sm'>
                  <Link
                    href='/user'
                    className='flex items-center gap-1 text-nowrap transition-all duration-300 hover:tracking-wider'>
                    <FaChevronRight size={14} className='text-primary' />
                    <p className=''>Thông tin tài khoản</p>
                  </Link>
                  <Link
                    href='/recharge'
                    className='flex items-center gap-1 text-nowrap transition-all duration-300 hover:tracking-wider'>
                    <FaChevronRight size={14} className='text-primary' />
                    <p className=''>Nạp tiền</p>
                  </Link>
                  <Link
                    href='/cart'
                    className='flex items-center gap-1 text-nowrap transition-all duration-300 hover:tracking-wider'>
                    <FaChevronRight size={14} className='text-primary' />
                    <p className=''>Giỏ hàng</p>
                  </Link>
                  <Link
                    href='/user/order-history'
                    className='flex items-center gap-1 text-nowrap transition-all duration-300 hover:tracking-wider'>
                    <FaChevronRight size={14} className='text-primary' />
                    <p className=''>Lịch sử mua hàng</p>
                  </Link>
                  <button
                    className='flex items-center gap-1 text-nowrap transition-all duration-300 hover:tracking-wider'
                    onClick={() => signOut()}>
                    <PiSignOutBold size={15} className='ml-1 text-yellow-400' />
                    <p className=''>Đăng xuất</p>
                  </button>
                </ul>
              </div>

              <div>
                <div className='text-gray-500 text-[12px] font-semibold'>NỔI BẬT</div>
                <ul className='tracking-wide text-sm'>
                  <div className='flex items-center gap-1 text-nowrap transition-all duration-300 hover:tracking-wider'>
                    <FaCheck size={14} className='text-green-400' />
                    <p className=''>Đầy đủ tính năng</p>
                  </div>
                  <div className='flex items-center gap-1 text-nowrap transition-all duration-300 hover:tracking-wider'>
                    <FaCheck size={14} className='text-green-400' />
                    <p className=''>Rẻ nhất thị trường</p>
                  </div>
                  <div className='flex items-center gap-1 text-nowrap transition-all duration-300 hover:tracking-wider'>
                    <FaCheck size={14} className='text-green-400' />
                    <p className=''>Thanh toán lập tức</p>
                  </div>
                  <div className='flex items-center gap-1 text-nowrap transition-all duration-300 hover:tracking-wider'>
                    <FaCheck size={14} className='text-green-400' />
                    <p className=''>Bảo hành uy tín</p>
                  </div>
                </ul>
              </div>
            </ul>
          </div>

          <Divider sx={{ my: 2 }} />

          {/* Bottom */}
          <div className='flex flex-wrap items-center justify-center md:justify-between gap-x-5 gap-y-1 text-center'>
            <p className='text-[14px] transition-all duration-300 hover:tracking-wide'>
              © <span className='text-primary font-semibold'>Anpha.shop</span>. All rights reserved
            </p>
            <p className='text-[14px] transition-all duration-300 hover:tracking-wide'>
              <span className='text-primary font-semibold'>Developed by</span> Nguyen Anh Khoa
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
