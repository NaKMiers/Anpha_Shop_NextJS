export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {/* Main */}
      <main className='px-21'>
        <div className='max-w-1200 mx-auto'>{children}</div>
      </main>
    </>
  )
}
