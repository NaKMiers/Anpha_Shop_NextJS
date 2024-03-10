import AdminMenu from '@/components/AdminMenu'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='min-h-screen w-full'>
      <AdminMenu />

      {children}
    </div>
  )
}
