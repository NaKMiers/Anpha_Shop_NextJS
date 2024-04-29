import LoadingMeta from '@/components/loading/LoadingMeta'
import LoadingPagination from '@/components/loading/LoadingPagination'
import LoadingProductCard from '@/components/loading/LoadingProductCard'

async function LoadingSearchPage() {
  return (
    <div className='pt-16'>
      {/* MARK: Meta */}
      <LoadingMeta hideSearch />

      {/* MARK: Amount */}
      <div className='flex items-center justify-end gap-2'>
        <span className='inline-block w-[50px] h-3 my-[16px] border-2 loading rounded' />
        <span className='inline-block w-[50px] h-3 my-[16px] border-2 loading rounded' />
      </div>

      {/* MARK: MAIN LIST */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-21 md:grid-cols-3 lg:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, index) => (
          <LoadingProductCard key={index} />
        ))}
      </div>

      {/* MARK: Pagination */}
      <LoadingPagination className='mt-11' />
    </div>
  )
}

export default LoadingSearchPage
