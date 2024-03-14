import StoreProvider from '@/libs/StoreProvider'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'
import ContactFloating from '@/components/ContactFloating'
import '../globals.scss'
import { getServerSession } from 'next-auth'

export const metadata: Metadata = {
  title: 'Anpha Shop | Shop Tài Khoản Cao Cấp và Tiện Lợi',
  description:
    'Chào mừng bạn đến với Anpha Shop, địa chỉ tin cậy cho những người đang tìm kiếm Account Cao Cấp. Tại Anpha Shop, chúng tôi tự hào mang đến cho bạn những tài khoản chất lượng và đẳng cấp, đáp ứng mọi nhu cầu của bạn. Khám phá bộ sưu tập Account Cao Cấp tại cửa hàng của chúng tôi ngay hôm nay và trải nghiệm sự khác biệt với Anpha Shop - Nơi đáng tin cậy cho sự đẳng cấp!',
}

export default async function RootLayout({
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

          <main className='px-21 max-w-1200 mx-auto'>{children}</main>

          <ContactFloating />

          <Footer />
        </StoreProvider>
      </body>
    </html>
  )
}
