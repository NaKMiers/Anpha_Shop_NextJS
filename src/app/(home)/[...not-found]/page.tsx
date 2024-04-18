import Image from 'next/image'
import Link from 'next/link'

function NotFoundPage() {
  return (
    <div className='pt-20 text-center text-white font-body tracking-wider'>
      <h1 className='mb-5 text-3xl font-semibold'>Không tìm thấy trang.</h1>

      <Link href='/' className='flex justify-center'>
        <Image
          className='rounded-medium shadow-medium-light'
          src='/images/404-page.jpg'
          width={500}
          height={500}
          alt='page-not-found'
        />
      </Link>

      <div className='mt-21'>
        <p className='text-xl'>
          Quay lại trang chủ{' '}
          <Link
            href='/'
            prefetch={false}
            className='underline text-sky-400 hover:text-sky-600 common-transition'>
            Trang chủ
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

export default NotFoundPage
