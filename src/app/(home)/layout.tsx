import ContactFloating from '@/components/ContactFloating'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import PageLoading from '@/components/PageLoading'
import StoreProvider from '@/libs/StoreProvider'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { Toaster } from 'react-hot-toast'
import '../globals.scss'

export const metadata: Metadata = {
  title: 'Anpha Shop | Shop Tài Khoản Cao Cấp và Tiện Lợi',
  description:
    'Chào mừng bạn đến với Anpha Shop, địa chỉ tin cậy cho những người đang tìm kiếm Account Cao Cấp. Tại Anpha Shop, chúng tôi tự hào mang đến cho bạn những tài khoản chất lượng và đẳng cấp, đáp ứng mọi nhu cầu của bạn. Khám phá bộ sưu tập Account Cao Cấp tại cửa hàng của chúng tôi ngay hôm nay và trải nghiệm sự khác biệt với Anpha Shop - Nơi đáng tin cậy cho sự đẳng cấp!',
  keywords:
    'shop, tài khoản, account, cao cấp, uy tín, chất lượng, đẳng cấp, anpha shop, account, mua acc, account gia re, shop account, shop acc gia re',
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png'],
  },
  manifest: '/site.webmanifest',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession()

  return (
    <html lang='vi'>
      <body className='text-dark' suppressHydrationWarning={true}>
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

          <PageLoading />

          <main className='px-21'>
            <div className='max-w-1200 mx-auto'>{children}</div>
          </main>

          <ContactFloating />

          <Footer />
        </StoreProvider>
      </body>
    </html>
  )
}
