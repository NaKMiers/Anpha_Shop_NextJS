import ContactFloating from '@/components/ContactFloating'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {/* Header */}
      <Header />

      <ContactFloating />

      {/* Main */}
      <main className='px-21'>
        <div className='max-w-1200 mx-auto'>{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </>
  )
}
