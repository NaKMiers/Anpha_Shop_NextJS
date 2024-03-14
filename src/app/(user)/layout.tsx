import StoreProvider from '@/libs/StoreProvider'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'
import ContactFloating from '@/components/ContactFloating'
import '../globals.scss'
import Link from 'next/link'
import { FaHistory, FaUser, FaUserLock } from 'react-icons/fa'
import { HiLightningBolt } from 'react-icons/hi'
import { getServerSession } from 'next-auth'

export const metadata: Metadata = {
  title: 'Anpha Shop | Shop Tài Khoản Cao Cấp và Tiện Lợi',
  description:
    'Chào mừng bạn đến với Anpha Shop, địa chỉ tin cậy cho những người đang tìm kiếm Account Cao Cấp. Tại Anpha Shop, chúng tôi tự hào mang đến cho bạn những tài khoản chất lượng và đẳng cấp, đáp ứng mọi nhu cầu của bạn. Khám phá bộ sưu tập Account Cao Cấp tại cửa hàng của chúng tôi ngay hôm nay và trải nghiệm sự khác biệt với Anpha Shop - Nơi đáng tin cậy cho sự đẳng cấp!',
}

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession()

  return (
    <html lang='vi'>
      <body className='text-dark'>
        <StoreProvider session={session}>
          <div className='background-app fixed w-screen h-screen top-0 left-0 -z-10' />
          <Toaster
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />

          <Header />

          <main className='px-21 max-w-1200 mx-auto'>
            <div className='flex flex-wrap lg:flex-nowrap mt-20 gap-21'>
              {/* Sidebar */}
              <ul className='h-full flex flex-row flex-shrink-0 justify-evenly lg:flex-col w-full lg:w-1/4 md:min-w-[265px] p-21 bg-white rounded-medium shadow-medium'>
                <li>
                  <Link
                    className='flex items-center gap-2 group hover:bg-secondary common-transition hover:rounded-lg px-4 py-4'
                    href='/user'>
                    <FaUser size={21} className='commont-transition group-hover:text-light' />
                    <span className='hidden md:block font-body text-[18px] font-semibold commont-transition group-hover:text-light'>
                      Thông tin tài khoản
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    className='flex items-center gap-2 group hover:bg-secondary common-transition hover:rounded-lg px-4 py-4'
                    href='/user'>
                    <FaHistory size={21} className='commont-transition group-hover:text-light' />
                    <span className='hidden md:block font-body text-[18px] font-semibold commont-transition group-hover:text-light'>
                      Lịch sử mua hàng
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    className='flex items-center gap-2 group hover:bg-secondary common-transition hover:rounded-lg px-4 py-4'
                    href='/user'>
                    <FaUserLock size={21} className='commont-transition group-hover:text-light' />
                    <span className='hidden md:block font-body text-[18px] font-semibold commont-transition group-hover:text-light'>
                      Mật khẩu - Bảo mật
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    className='flex items-center gap-2 group hover:bg-secondary common-transition hover:rounded-lg px-4 py-4'
                    href='/user'>
                    <HiLightningBolt size={21} className='commont-transition group-hover:text-light' />
                    <span className='hidden md:block font-body text-[18px] font-semibold commont-transition group-hover:text-light'>
                      Nạp tiền vào tài khoản
                    </span>
                  </Link>
                </li>
              </ul>

              {/* Content */}
              <div className='w-full bg-white rounded-medium shadow-medium p-8'>{children}</div>
            </div>
          </main>

          <ContactFloating />

          <Footer />
        </StoreProvider>
      </body>
    </html>
  )
}
