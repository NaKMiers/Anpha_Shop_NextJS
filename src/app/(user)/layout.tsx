import ContactFloating from '@/components/ContactFloating'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import StoreProvider from '@/libs/StoreProvider'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import { FaHistory, FaUser, FaUserLock } from 'react-icons/fa'
import { HiLightningBolt } from 'react-icons/hi'
import '../globals.scss'

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

  // get pathname
  const headersList = headers()
  const pathname = headersList.get('x-url') || ''

  return (
    <html lang='vi'>
      <body className='text-dark px-21' suppressHydrationWarning={true}>
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

          <Header isStatic />

          <main className='max-w-1200 mx-auto'>
            <div className='flex flex-wrap lg:flex-nowrap mt-12 gap-21'>
              {/* Sidebar */}
              <ul className='h-full flex flex-row flex-shrink-0 justify-evenly lg:flex-col w-full lg:w-1/4 md:min-w-[265px] p-21 bg-white rounded-medium shadow-medium'>
                <li>
                  <Link
                    className={`flex items-center gap-2 group hover:bg-secondary hover:text-light hover:rounded-lg common-transition px-4 py-4 ${
                      pathname === '/user' ? 'bg-primary rounded-lg text-light' : ''
                    }`}
                    href='/user'>
                    <FaUser size={21} className='commont-transition' />
                    <span className='hidden md:block font-body text-[18px] font-semibold commont-transition'>
                      Thông tin tài khoản
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    className={`flex items-center gap-2 group hover:bg-secondary hover:text-light hover:rounded-lg common-transition px-4 py-4 ${
                      pathname === '/user/order-history' ? 'bg-primary rounded-lg text-light' : ''
                    }`}
                    href='/user/order-history'>
                    <FaHistory size={21} className='commont-transition' />
                    <span className='hidden md:block font-body text-[18px] font-semibold commont-transition'>
                      Lịch sử mua hàng
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    className={`flex items-center gap-2 group hover:bg-secondary hover:text-light hover:rounded-lg common-transition px-4 py-4 ${
                      pathname === '/user/security' ? 'bg-primary rounded-lg text-light' : ''
                    }`}
                    href='/user/security'>
                    <FaUserLock size={21} className='commont-transition' />
                    <span className='hidden md:block font-body text-[18px] font-semibold commont-transition'>
                      Mật khẩu - Bảo mật
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    className={`flex items-center gap-2 group hover:bg-secondary hover:text-light hover:rounded-lg common-transition px-4 py-4 ${
                      pathname === '/recharge' ? 'bg-primary rounded-lg text-light' : ''
                    }`}
                    href='/recharge'>
                    <HiLightningBolt size={21} className='commont-transition' />
                    <span className='hidden md:block font-body text-[18px] font-semibold commont-transition'>
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
