import ContactFloating from '@/components/ContactFloating'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import UserMenu from '@/components/UserMenu'

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {/* Header */}
      <Header isStatic />

      {/* Contact Floating */}
      <ContactFloating />

      {/* Main */}
      <main className='px-21'>
        <div className='max-w-1200 mx-auto flex flex-wrap lg:flex-nowrap mt-12 gap-21'>
          {/* Sidebar */}
          <UserMenu />

          {/* Content */}
          <div className='w-full bg-white rounded-medium shadow-medium p-8'>{children}</div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  )
}
